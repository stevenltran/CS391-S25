import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; 
import Login from "./pages/login"; 
import Profile from "./pages/profile";
import Register from "./pages/register";
import EventList from "./pages/eventlist";
import Navbar from "./components/Navbar";
import CreateEvent from "./pages/createevent";
import Notifications from "./pages/notifications";
import ManageEvents from "./pages/manageevents";
import EditEvents from "./pages/editevent";

import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { requestNotificationPermission } from "./requestPermission";
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";

import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    requestNotificationPermission();
  
    // Listen for notifications
    onMessage(messaging, async (payload) => {
      console.log("Received message:", payload);

      const { title, body } = payload.notification;
      const messageId = payload.messageId;
  
      const newNotification = {
        title,
        body,
        id: messageId,
        timestamp: new Date(),
      };

      setNotifications((prev) => [...prev, newNotification]);
        
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "notifications"), {
          userId: user.uid,
          title: title,
          body: body,
          timestamp: new Date(),
        });
        console.log("Saved notification to Firestore.");
      }

      // Show popup
      toast.info(`${title}: ${body}`, {
        position: "top-center",
        autoClose: 5000,
      });
    });
  }, []);

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/events" element={<EventList />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/notifications" element={<Notifications notifications={notifications} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manageevents" element={<ManageEvents />} />
        <Route path="/edit/:id" element={<EditEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
