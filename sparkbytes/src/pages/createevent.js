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

const handleSubmit = async (e) => {
  e.preventDefault();

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to create an event.");
    return;
  }

  const { date, startTime, endTime } = formData;

  const eventDateTime = new Date(`${date}T${startTime}`);
  const now = new Date();

  if (isNaN(eventDateTime.getTime())) {
    alert("Invalid date or time.");
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

  const formattedStart = formatTime(startTime);
  const formattedEnd = formatTime(endTime);

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

    }

    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);

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