import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../AuthContext";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link
          to={currentUser ? "/events" : "/"}
          className="navbar-logo"
        >
          SparkBytes!
        </Link>
      </div>

      <div className="navbar-links">
        {!currentUser ? (
          <Link to="/login" className="navbar-button">
            Login
          </Link>
        ) : (
          <>
            <LogoutButton />
            <Link to="/profile" className="navbar-button">Profile</Link>
            <Link to="/events" className="navbar-button">Events</Link>
            <Link to="/manageevents" className="navbar-button">My Events</Link>
            <Link to="/notifications" className="navbar-button">Notifications</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
