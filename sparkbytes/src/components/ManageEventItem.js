import "./ManageEventItem.css";

function ManageEventItem({ event, onEdit, onDelete, rsvpUsers = [] }) {
  return (
    <div className="manage-event-item">
      <div className="event-info">
        <h3>{event.title}</h3>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Food Type:</strong> {event.foodType}</p>
        <p><strong>RSVP Limit:</strong> {event.limit}</p>
        <p><strong>RSVP Count:</strong> {event.rsvps?.length || 0}</p>

        {rsvpUsers.length > 0 && (
          <div className="rsvp-list">
            <p><strong>RSVPed Users:</strong></p>
            <ul>
              {rsvpUsers.map((user) => (
                <li key={user.uid}>
                  {user.name || user.email || "Unknown"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="event-actions">
        <button className="edit-button" onClick={onEdit}>Edit</button>
        <button className="delete-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ManageEventItem;
