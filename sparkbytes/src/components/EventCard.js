/**
 * EventCard Component
 * 
 * This component displays a single event's details, including:
 * - Title
 * - Description
 * - Location
 * - Date and time range
 * 
 * These cards populate the event list page.
 */

import "./EventCard.css";

function EventCard({
  title,
  description,
  location,
  date,
  startTime,
  endTime,
  tags = [],
  rsvps,
  limit,
  onRSVP,
  isUserRSVPed,
  isFull,
}) {
  return (
    <div className="event-card-wrapper">
      <h3>{title}</h3>
      <p>{description}</p>

      <p>
        <strong>Location:</strong>{" "}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="location-link"
        >
          {location}
        </a>
      </p>
<<<<<<< HEAD

      <p><strong>Date:</strong> {date}</p>

=======
      <p><strong>Date:</strong> {date}</p>
      
>>>>>>> c5ffa16 (Added end time + sparkbytes logo select)
      <p>
        <strong>Time:</strong>{" "}
        {endTime ? `${startTime} – ${endTime}` : startTime}
      </p>

      {/* Tags */}
      <div className="event-tags">
        {tags.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>

      {/* RSVP Badge */}
      <p className="rsvp-status">
        {isFull ? (
          <span className="badge filled">Filled</span>
        ) : (
          <span className="badge open">
            {rsvps.length}/{limit} spots filled
          </span>
        )}
      </p>

      {/* RSVP Button */}
      <button
        className={`rsvp-btn ${isUserRSVPed ? "cancel" : ""}`}
        onClick={onRSVP}
        disabled={!isUserRSVPed && isFull}
      >
        {isUserRSVPed
          ? "Cancel RSVP"
          : isFull
          ? "Event Full"
          : "RSVP"}
      </button>
    </div>
  );
}

export default EventCard;
