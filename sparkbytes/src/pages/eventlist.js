/**
 * EventList Page
 * 
 * This page displays a list of events as EventCards.
 * 
 */

import EventCard from "../components/EventCard";
import "./eventlist.css"

function EventList() {
  const dummyEvents = [
    {
      title: "Free Pizza Friday",
      description: "Come grab a slice!",
      location: "Student Union",
      date: "2025-04-05",
    },
    {
      title: "Tech Talk: AI + You",
      description: "Learn how AI is changing software development.",
      location: "Engineering Building 204",
      date: "2025-04-08",
    },
    {
      title: "Open Mic Night",
      description: "Bring your talent to the stage.",
      location: "Campus Cafe",
      date: "2025-04-12",
    },
  ];

  return (
    <div className="event-page">
      <h2 className="event-title">All Events</h2>
      <div className="event-list-container">
        {dummyEvents.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            description={event.description}
            location={event.location}
            date={event.date}
          />
        ))}
      </div>
    </div>
  );
}

export default EventList;
