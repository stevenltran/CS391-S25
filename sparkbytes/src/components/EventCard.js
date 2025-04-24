/**
 * EventCard Component
 * 
 * This component displays a single event's details, including:
 * - Title
 * - Description
 * - Location
 * - Date (formatted)
 * 
 * These cards will populate the event list page.
 * 
 */

import "./EventCard.css";

function EventCard({
  title,
  description,
  location,
  date,
  tags = [], // tags now replaces foodType
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
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Date:</strong> {date}</p>

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
