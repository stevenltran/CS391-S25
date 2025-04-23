import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./eventlist.css";

function EventList() {
  const [filter, setFilter] = useState("All");
  const [events, setEvents] = useState([]);

  const foodTypes = ["All", "Vegan", "Halal", "Kosher", "Vegetarian", "Regular"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleRSVP = async (index) => {
    const user = "me"; // replace with real user later
    const updated = [...events];
    const event = updated[index];
    const eventRef = doc(db, "events", event.id);

    let newRSVPs;
    if (event.rsvps.includes(user)) {
      newRSVPs = event.rsvps.filter((r) => r !== user);
    } else if (event.rsvps.length < event.limit) {
      newRSVPs = [...event.rsvps, user];
    } else {
      return;
    }

    try {
      await updateDoc(eventRef, { rsvps: newRSVPs });
      updated[index].rsvps = newRSVPs;
      setEvents(updated);
    } catch (err) {
      console.error("Error updating RSVP:", err);
    }
  };

  const filteredEvents = events.filter(
    (event) => filter === "All" || event.foodType === filter
  );

  return (
    <div className="event-page">
      <h2 className="event-title">All Events</h2>

      <div className="filter-bar">
        {foodTypes.map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="event-list-container">
        {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            location={event.location}
            date={event.date}
            foodType={event.foodType}
            rsvps={event.rsvps}
            limit={event.limit}
            isUserRSVPed={event.rsvps.includes("me")}
            isFull={event.rsvps.length >= event.limit}
            onRSVP={() => handleRSVP(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default EventList;