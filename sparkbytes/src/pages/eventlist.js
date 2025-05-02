import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import "./eventlist.css";

// Helper to parse both 24h ("15:30") and 12h ("3:30 PM") time strings into hours/minutes
function parseTimeTo24Hour(timeStr) {
  if (!timeStr) return { hours: 23, minutes: 59 };
  const parts = timeStr.trim().split(/\s+/);
  const [timePart, modifier] = parts;
  let [hours, minutes] = timePart.split(":").map(Number);
  const mod = modifier?.toUpperCase();
  if (mod === "PM" && hours < 12) hours += 12;
  if (mod === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function EventList() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();

  const foodTypes = ["Vegan", "Halal", "Kosher", "Vegetarian", "Gluten-Free"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRSVP = async eventId => {
    if (!currentUser?.uid) {
      alert("You must be logged in to RSVP!");
      return;
    }
    const updated = [...events];
    const idx = updated.findIndex(e => e.id === eventId);
    if (idx === -1) return;
    const ev = updated[idx];
    const eventRef = doc(db, "events", ev.id);
    const userId = currentUser.uid;

    let newRSVPs;
    if (ev.rsvps.includes(userId)) {
      newRSVPs = ev.rsvps.filter(uid => uid !== userId);
    } else if (ev.rsvps.length < ev.limit) {
      newRSVPs = [...ev.rsvps, userId];
    } else {
      alert("This event is full.");
      return;
    }

    try {
      await updateDoc(eventRef, { rsvps: newRSVPs });
      updated[idx].rsvps = newRSVPs;
      setEvents(updated);
    } catch (err) {
      console.error("Error updating RSVP:", err);
    }
  };

  // Filter out past and closed events, then by tags, then sort by timestamp
  const filteredEvents = events
    .filter(ev => {
      // skip closed entirely
      if (ev.closed) return false;

      // tag filter
      if (
        selectedTags.length > 0 &&
        !selectedTags.every(tag => ev.tags?.includes(tag))
      ) {
        return false;
      }

      // must have endTimestamp
      if (!ev.endTimestamp) return false;
      const endDate = ev.endTimestamp.toDate();
      if (endDate < new Date()) return false;

      return true;
    })
    .sort((a, b) => {
      const at = a.startTimestamp?.toDate();
      const bt = b.startTimestamp?.toDate();
      return at - bt;
    });

  return (
    <div className="event-page">
      <h2 className="event-title">All Events</h2>

      <div className="filter-bar">
        {foodTypes.map(type => (
          <button
            key={type}
            className={selectedTags.includes(type) ? "active" : ""}
            onClick={() => toggleTag(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="event-list-container">
        {filteredEvents.map(ev => (
          <EventCard
            key={ev.id}
            title={ev.title}
            description={ev.description}
            location={ev.location}
            date={ev.date}
            startTime={ev.startTime}
            endTime={ev.endTime}
            tags={ev.tags}
            rsvps={ev.rsvps}
            limit={ev.limit}
            isUserRSVPed={ev.rsvps.includes(currentUser?.uid)}
            isFull={ev.rsvps.length >= ev.limit}
            onRSVP={() => handleRSVP(ev.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default EventList;
