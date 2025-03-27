import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div>
      <div className="home-container">
        <h1>Welcome to SparkBytes!</h1>
        <p>Food finds for hungry students.</p>
        <Link to="/login" className="home-button">Get Started</Link>
      </div>
    </div>
  );
}

export default Home;