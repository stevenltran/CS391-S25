import "./NotificationCard.css";

function NotificationCard({ title, body, receivedAt, onDismiss }) {
  return (
    <div className="notification-card">
      <h4>{title}</h4>
      <p>{body}</p>
      <p className="notif-time">Received: {new Date(receivedAt).toLocaleString()}</p>
      <button onClick={onDismiss} className="dismiss-btn">Dismiss</button>
    </div>
  );
}

export default NotificationCard;
