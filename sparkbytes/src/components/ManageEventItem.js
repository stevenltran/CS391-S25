import "./ManageEventItem.css";

function ManageEventItem({ event, onEdit, onDelete, rsvpUsers, onClose }) {
  return (
    <div className="manage-event-item">
      <div className="event-info">
        <h3>{event.title}</h3>

        {/* Date and Time combined */}
        <p>
          <strong>Date & Time:</strong>{" "}
          {event.date} {event.startTime}
          {event.endTime ? ` – ${event.endTime}` : ""}
        </p>

        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>RSVP Limit:</strong> {event.limit}</p>

        {/* Food Type (comma-separated list) */}
        {event.tags && event.tags.length > 0 && (
          <p>
            <strong>Food Type:</strong> {event.tags.join(", ")}
          </p>
        )}

        {/* RSVP user list */}
        {rsvpUsers.length > 0 && (
          <div className="rsvp-list">
            <strong>RSVPs:</strong>
            <ul>
              {rsvpUsers.map((user) => (
                <li key={user.uid}>{user.name || user.email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="event-actions">
        <button className="edit-button" onClick={onEdit}>Edit</button>
        <button className="close-button" onClick={onClose}>Close Event</button>
        <button className="delete-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ManageEventItem;
