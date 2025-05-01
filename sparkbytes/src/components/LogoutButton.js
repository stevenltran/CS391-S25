import { signOut } from "firebase/auth";
import { auth, db, messaging } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { deleteToken } from "firebase/messaging";

function LogoutButton({ className = "navbar-button" }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!currentUser) return;

    try {
      // Delete FCM token locally
      await deleteToken(messaging);

      // Remove FCM token from Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        fcmToken: "",
      });
      console.log("FCM token deleted from Firestore");

      // Sign out
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!currentUser) return null;

  return (
    <button onClick={handleLogout} className="logout-button">
    Logout
  </button>
  );
}

export default LogoutButton;
