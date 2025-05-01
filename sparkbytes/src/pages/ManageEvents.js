import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ManageEventItem from "../components/ManageEventItem";
import "./createevent.css";

import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

function ManageEvents() {
  const [myEvents, setMyEvents] = useState([]);
  const [rsvpUserMap, setRsvpUserMap] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEventsAndRSVPs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const mine = data.filter((event) => event.creator === user?.uid);
        setMyEvents(mine);

        // Fetch RSVP user data for each event
        const userMap = {};
        for (const event of mine) {
          const rsvpUsers = await Promise.all(
            (event.rsvps || []).map(async (uid) => {
              if (userMap[uid]) return userMap[uid];
              const userDoc = await getDoc(doc(db, "users", uid));
              const userData = userDoc.exists()
                ? { uid, ...userDoc.data() }
                : { uid, email: "Unknown User" };
              userMap[uid] = userData;
              return userData;
            })
          );
          setRsvpUserMap((prev) => ({ ...prev, [event.id]: rsvpUsers }));
        }
      } catch (err) {
        console.error("Error fetching events or RSVP user data:", err);
      }
    };

    if (user) {
      fetchEventsAndRSVPs();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setMyEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleCloseEvent = async (event) => {
    if (!window.confirm("Are you sure you want to close and delete this event? This will notify all RSVPed users and remove the event.")) {
      return;
    }

    try {
      const closeEventFunc = httpsCallable(functions, "closeEvent");
      await closeEventFunc({ eventId: event.id });

      await deleteDoc(doc(db, "events", event.id));

      setMyEvents((prev) => prev.filter((e) => e.id !== event.id));

      alert("Event closed, notifications sent, and event deleted.");
    } catch (error) {
      console.error("Error closing or deleting event:", error);
      alert("There was an error. Please try again.");
    }
  };

  return (
    <div className="create-event-container">
      <h2>My Created Events</h2>

      <button
        className="create-event-button"
        onClick={() => navigate("/createevent")}
      >
        + Create New Event
      </button>

      {myEvents.length === 0 ? (
        <p>You haven’t created any events yet.</p>
      ) : (
        <div className="event-list-container">
          {myEvents.map((event) => (
            <ManageEventItem
              key={event.id}
              event={event}
              rsvpUsers={rsvpUserMap[event.id] || []}
              onEdit={() => navigate(`/edit/${event.id}`)}
              onDelete={() => handleDelete(event.id)}
              onClose={() => handleCloseEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
