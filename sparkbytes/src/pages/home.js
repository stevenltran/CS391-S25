import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./home.css";

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