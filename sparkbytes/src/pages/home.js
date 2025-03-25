import { Link } from "react-router-dom";
import "./home.css";

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

function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h1>Welcome to SparkBytes!</h1>
        <p>Claim your food here.</p>
        <Link to="/login" className="home-button">Get Started</Link>
      </div>
    </div>
  );
}

export default Home;