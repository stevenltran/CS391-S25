// src/pages/ManageEvents.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import ManageEventItem from "../components/ManageEventItem";
import "./createevent.css";

function ManageEvents() {
  const [myEvents, setMyEvents] = useState({ upcoming: [], past: [] });
  const [rsvpUserMap, setRsvpUserMap] = useState({});
  const navigate = useNavigate();
  const user = getAuth().currentUser;

  // Initialize the callable function
  const functions = getFunctions();
  const closeEventFn = httpsCallable(functions, "closeEvent");

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const allEvents = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const mine = allEvents.filter(e => e.creator === user?.uid);

      const now = new Date();
      const upcoming = [];
      const past = [];
      const rsvpMap = {};

      for (const ev of mine) {
        // determine end date
        let endDate;
        if (ev.endTimestamp instanceof Date) {
          endDate = ev.endTimestamp;
        } else if (ev.endTimestamp?.toDate) {
          endDate = ev.endTimestamp.toDate();
        } else {
          endDate = new Date(`${ev.date}T23:59`);
        }

        // split into upcoming vs past
        if (ev.closed || endDate < now) {
          past.push(ev);
        } else {
          upcoming.push(ev);
        }

        // fetch RSVP user details
        const users = [];
        for (const uid of ev.rsvps || []) {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            users.push({ uid, ...userSnap.data() });
          } else {
            users.push({ uid, email: "Unknown" });
          }
        }
        rsvpMap[ev.id] = users;
      }

      setMyEvents({ upcoming, past });
      setRsvpUserMap(rsvpMap);
    };

    if (user) fetchEvents();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "events", id));
    setMyEvents(prev => ({
      upcoming: prev.upcoming.filter(e => e.id !== id),
      past:      prev.past.filter(e => e.id !== id),
    }));
  };

  const handleClose = async (id) => {
    if (!window.confirm("Are you sure you want to close this event?")) return;

    try {
      // call the Cloud Function to send notifications/emails
      await closeEventFn({ eventId: id });

      // mark the event as closed in Firestore
      await updateDoc(doc(db, "events", id), { closed: true });

      // move it from upcoming → past in local state
      setMyEvents(prev => {
        const closing = prev.upcoming.find(e => e.id === id);
        return {
          upcoming: prev.upcoming.filter(e => e.id !== id),
          past:      closing ? [...prev.past, closing] : prev.past,
        };
      });
    } catch (err) {
      console.error("Error closing event:", err);
      alert("Failed to close event. Please try again.");
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

      <h3>Upcoming Events</h3>
      {myEvents.upcoming.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="event-list-container">
          {myEvents.upcoming.map(ev => (
            <ManageEventItem
              key={ev.id}
              event={ev}
              rsvpUsers={rsvpUserMap[ev.id] || []}
              onEdit={() => navigate(`/edit/${ev.id}`)}
              onDelete={() => handleDelete(ev.id)}
              onClose={() => handleClose(ev.id)}
            />
          ))}
        </div>
      )}

      <h3>Past Events</h3>
      {myEvents.past.length === 0 ? (
        <p>No past events.</p>
      ) : (
        <div className="event-list-container">
          {myEvents.past.map(ev => (
            <ManageEventItem
              key={ev.id}
              event={ev}
              rsvpUsers={rsvpUserMap[ev.id] || []}
              isPast
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageEvents;