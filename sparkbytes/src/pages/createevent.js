import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createevent.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function CreateEventForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    tags: [],
    limit: "",
    foodGone: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatTime = (rawTime) => {
    if (!rawTime) return "";
    const [hourStr, minute] = rawTime.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to create an event.");
      return;
    }

<<<<<<< HEAD
    const { date, startTime, endTime } = formData;
    const eventDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
=======
    // Check that the event time is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.startTime}`);
>>>>>>> 3b7f30e (icon changed)

    if (isNaN(eventDateTime.getTime())) {
      alert("Invalid date or time.");
      return;
<<<<<<< HEAD
=======
    }
    
    if (eventDateTime <= new Date()) {
      alert("Please select a future time for the event.");
      return;
    }

    // Format time for display
    const rawTime = formData.startTime;
    let formattedTime = "";
    if (rawTime) {
      const [hourStr, min] = rawTime.split(":");
      let hr = parseInt(hourStr, 10);
      const ampm = hr >= 12 ? "PM" : "AM";
      hr = hr % 12 || 12;
      formattedTime = `${hr}:${min} ${ampm}`;
<<<<<<< HEAD
>>>>>>> 3b7f30e (icon changed)
    }

    if (eventDateTime <= now) {
      alert("Please select a future time for the event.");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
=======
    const start = formData.startTime;
    const end = formData.endTime;

    if (start && end && start >= end) {
      alert("End time must be after start time.");
=======
    const { date, startTime, endTime } = formData;
    const eventDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();

    if (isNaN(eventDateTime.getTime())) {
      alert("Invalid date or time.");
>>>>>>> a4c12e8 (.)
      return;
    }

    if (eventDateTime <= now) {
      alert("Please select a future time for the event.");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);
>>>>>>> c5ffa16 (Added end time + sparkbytes logo select)

    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        startTime: formattedStart,
        endTime: formattedEnd,
        limit: parseInt(formData.limit),
        rsvps: [],
        creator: user.uid,
        createdAt: new Date(),
        foodGone: false,
        reminder15Sent: false,
      });

      navigate("/events");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <label><strong>Date:</strong></label>
        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
        />

        <label><strong>Start Time:</strong></label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
<<<<<<< HEAD
        />

        <label><strong>End Time:</strong></label>
        <input 
          type="time" 
          name="endTime" 
          value={formData.endTime}
          onChange={handleChange}
=======
>>>>>>> 3b7f30e (icon changed)
        />

        <label><strong>End Time:</strong></label>
        <input 
          type="time" 
          name="endTime" 
          value={formData.endTime}
          onChange={handleChange}
        />

        <label><strong>Food Type:</strong></label>
        <div className="tag-checkboxes">
          {["Vegan", "Halal", "Kosher", "Vegetarian", "Gluten-Free"].map((tag) => (
            <label
              key={tag}
              className={formData.tags.includes(tag) ? "selected" : ""}
              onClick={() => {
                const isSelected = formData.tags.includes(tag);
                setFormData((prev) => ({
                  ...prev,
                  tags: isSelected
                    ? prev.tags.filter((t) => t !== tag)
                    : [...prev.tags, tag],
                }));
              }}
            >
              {tag}
            </label>
          ))}
        </div>

        <input
          type="number"
          name="limit"
          placeholder="RSVP Limit"
          onChange={handleChange}
          required
          min={1}
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEventForm;