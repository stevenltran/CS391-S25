import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; 
import Login from "./pages/login"; 
import Profile from "./pages/profile";
import "./App.css";

import EventList from "./pages/eventlist";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/events" element={<EventList />} />
      </Routes>
    </Router>
  );
}

export default App;
