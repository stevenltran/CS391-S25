import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function LogoutButton({ className = "navbar-button" }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!currentUser) return null;

  return (
    <button onClick={handleLogout} className="navbar-button logout-button">
    Logout
    </button>

  );
}

export default LogoutButton;
