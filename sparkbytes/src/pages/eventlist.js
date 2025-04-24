import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import "./eventlist.css";

function EventList() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();

  const foodTypes = ["Vegan", "Halal", "Kosher", "Vegetarian", "Gluten-Free"];

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

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRSVP = async (index) => {
    if (!currentUser?.uid) {
      alert("You must be logged in to RSVP!");
      return;
    }

    const userId = currentUser.uid;
    const updated = [...events];
    const event = updated[index];
    const eventRef = doc(db, "events", event.id);

    let newRSVPs;

    if (event.rsvps.includes(userId)) {
      newRSVPs = event.rsvps.filter((uid) => uid !== userId);
    } else if (event.rsvps.length < event.limit) {
      newRSVPs = [...event.rsvps, userId];
    } else {
      alert("This event is full.");
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
  
  const filteredEvents = events.filter((event) => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every((tag) => event.tags?.includes(tag));
  });
  

  return (
    <div className="event-page">
      <h2 className="event-title">All Events</h2>

      <div className="filter-bar">
        {foodTypes.map((type) => (
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
        {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            location={event.location}
            date={event.date}
            tags={event.tags}
            rsvps={event.rsvps}
            limit={event.limit}
            isUserRSVPed={event.rsvps.includes(currentUser?.uid)}
            isFull={event.rsvps.length >= event.limit}
            onRSVP={() => handleRSVP(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default EventList;
