import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to SparkBytes!</h1>
      <p>Claim your food here.</p>
      <Link to="/login" className="home-button">Get Started</Link>
      <Link to="profile">profile</Link>
    </div>
  );
}

export default Home;