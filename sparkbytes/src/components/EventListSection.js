import EventCard from "./EventCard";

function EventListSection({ title, events, currentUser, onRSVP, onDelete, showDelete }) {
  return (
    <div className="event-section">
      <h3 className="event-subtitle">{title}</h3>
      <div className="event-list-container">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            location={event.location}
            date={event.date}
            foodType={event.foodType}
            rsvps={event.rsvps}
            limit={event.limit}
            isUserRSVPed={event.rsvps.includes(currentUser)}
            isFull={event.rsvps.length >= event.limit}
            onRSVP={() => onRSVP(index)}
            onDelete={() => onDelete(event.id)}
            showDelete={showDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default EventListSection;