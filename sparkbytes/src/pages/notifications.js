import { useState } from "react";
import { Link } from "react-router-dom";
import "./notifications.css";

function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      message: "You successfully claimed a meal from BU Dining!",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "Your event 'Late Night Snacks' has 25 RSVPs.",
      time: "1 day ago",
    },
    {
      id: 3,
      message: "Your profile was updated.",
      time: "3 days ago",
    },
  ]);

  return (
    <div className="notif-wrapper">
      <div className="notif-card">
        <h1>Notifications</h1>
        {notifications.length === 0 ? (
          <p className="empty-msg">No new notifications.</p>
        ) : (
          <ul className="notif-list">
            {notifications.map((n) => (
              <li key={n.id}>
                <p className="notif-text">{n.message}</p>
                <span className="notif-time">{n.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/" className="home-btn">← Back to Home</Link>
    </div>
  );
}

export default Notifications;