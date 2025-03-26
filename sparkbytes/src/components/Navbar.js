import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">SparkBytes!</Link>
      </div>
      <div className="navbar-links">
        <Link to="/login" className="navbar-button">Login</Link>
        <Link to="profile" className="navbar-button">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;
