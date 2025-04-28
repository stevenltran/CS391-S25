import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import NotificationCard from "../components/NotificationCard";
import "./notifications.css";

function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(fetched.sort((a, b) => 
        b.timestamp?.toDate() - a.timestamp?.toDate()
      ));
    };

    fetchNotifications();
  }, [currentUser]);

  return (
    <div className="notif-wrapper">
      <div className="notif-card">
        <h1>Notifications</h1>

        {notifications.length === 0 ? (
          <p className="empty-msg">No new notifications.</p>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                title={n.title}
                body={n.body}
                receivedAt={n.timestamp?.toDate().toISOString() || new Date().toISOString()}
              />
            ))}
          </div>
        )}
      </div>

      <Link to="/" className="home-btn">← Back to Home</Link>
    </div>
  );
}

export default Notifications;
