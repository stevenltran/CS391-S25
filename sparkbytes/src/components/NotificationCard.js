import "./NotificationCard.css";

function NotificationCard({ title, body, receivedAt }) {
  return (
    <div className="notification-card">
      <h4>{title}</h4>
      <p>{body}</p>
      <p className="notif-time">Received: {new Date(receivedAt).toLocaleString()}</p>
    </div>
  );
}

export default NotificationCard;
