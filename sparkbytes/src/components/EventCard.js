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

function EventCard({ title, description, location, date }) {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
    </div>
  );
}

export default EventCard;
