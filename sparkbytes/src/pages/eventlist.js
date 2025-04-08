import { useState } from "react";
import EventCard from "../components/EventCard";
import "./eventlist.css";

function EventList() {
  const [filter, setFilter] = useState("All");

  const [events, setEvents] = useState([
    {
      title: "Free Pizza Friday",
      description: "Come grab a slice!",
      location: "Student Union",
      date: "2025-04-05",
      foodType: "Vegetarian",
      limit: 3,
      rsvps: ["me"],
    },
    {
      title: "Open Mic Night",
      description: "Show off your talent with food and fun.",
      location: "Campus Café",
      date: "2025-04-12",
      foodType: "Vegan",
      limit: 2,
      rsvps: ["me", "friend"],
    },
    {
      title: "Midnight Munchies",
      description: "Snacks and vibes for all!",
      location: "Dorm Lounge",
      date: "2025-04-10",
      foodType: "Halal",
      limit: 5,
      rsvps: [],
    },
    {
      title: "Shabbat Dinner",
      description: "Traditional meal with friends.",
      location: "Hillel House",
      date: "2025-04-13",
      foodType: "Kosher",
      limit: 4,
      rsvps: [],
    },
  ]);

  const foodTypes = ["All", "Vegan", "Halal", "Kosher", "Vegetarian", "Regular"];

  const handleRSVP = (index) => {
    const updated = [...events];
    const user = "me";
    const event = updated[index];

    if (event.rsvps.includes(user)) {
      event.rsvps = event.rsvps.filter((r) => r !== user); // Cancel
    } else if (event.rsvps.length < event.limit) {
      event.rsvps.push(user); // RSVP
    }

    setEvents(updated);
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
            key={index}
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