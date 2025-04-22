import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; 
import Login from "./pages/login"; 
import Profile from "./pages/profile";
import Register from "./pages/register";
import "./App.css";

import EventList from "./pages/eventlist";
import Navbar from "./components/Navbar";
import CreateEvent from "./pages/createevent";
import Notifications from "./pages/notifications";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/events" element={<EventList />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
