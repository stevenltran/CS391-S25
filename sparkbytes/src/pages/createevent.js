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
  });

  // Compute today's date for min
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create an event.");
      return;
    }

    const { date, startTime, endTime, limit, tags, title, description, location } = formData;
    const now = new Date();

    // Parse into Date objects
    const [year, month, day] = date.split('-').map(Number);
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startTimestamp = new Date(year, month - 1, day, sh, sm);
    const endTimestamp   = new Date(year, month - 1, day, eh, em);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      alert("Invalid date or time format.");
      return;
    }
    if (startTimestamp <= now) {
      alert("Start time must be in the future.");
      return;
    }
    if (endTimestamp <= startTimestamp) {
      alert("End time must be after start time.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        location,
        date,
        startTime,
        endTime,
        startTimestamp,
        endTimestamp,
        tags,
        limit: parseInt(limit, 10),
        rsvps: [],
        creator: user.uid,
        createdAt: new Date(),
        foodGone: false,
        reminder15Sent: false,
      });
      navigate("/events");
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Something went wrong. Please try again.");
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
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={minDate}
        />

        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <label>Food Type</label>
        <div className="tag-checkboxes">
          {['Vegan','Halal','Kosher','Vegetarian','Gluten-Free'].map(tag => (
            <label
              key={tag}
              className={formData.tags.includes(tag) ? 'selected' : ''}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  tags: prev.tags.includes(tag)
                    ? prev.tags.filter(t => t !== tag)
                    : [...prev.tags, tag]
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
          value={formData.limit}
          onChange={handleChange}
          min={1}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEventForm;
