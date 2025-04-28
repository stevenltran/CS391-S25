import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./createevent.css";
import { useAuth } from "../AuthContext";

const AVAILABLE_TAGS = ["Vegan", "Halal", "Kosher", "Vegetarian", "Gluten-Free"];

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.creator !== currentUser?.uid) {
            alert("You are not allowed to edit this event.");
            return navigate("/events");
          }

          setFormData({
            ...data,
            tags: data.tags || []
          });
        } else {
          alert("Event not found.");
          navigate("/manageevents");
        }
      } catch (error) {
        console.error("Error loading event:", error);
      }
    };

    if (currentUser) fetchEvent();
  }, [id, navigate, currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format startTime before saving
    let formattedTime = formData.startTime;
    if (formattedTime && formattedTime.includes(":") && !formattedTime.includes("AM") && !formattedTime.includes("PM")) {
      const [hourStr, minute] = formattedTime.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      formattedTime = `${hour}:${minute} ${ampm}`;
    }

    try {
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        ...formData,
        startTime: formattedTime,
        limit: parseInt(formData.limit),
      });
      alert("Event updated successfully!");
      navigate("/manageevents");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update event.");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="create-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Event Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder="Event Description"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <label><strong>Date:</strong></label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <label><strong>Start Time:</strong></label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime.split(" ")[0]} // show clean input without AM/PM
          onChange={handleChange}
          required
        />

        <label><strong>Food Type:</strong></label>
        <div className="tag-checkboxes">
          {AVAILABLE_TAGS.map((tag) => (
            <label
              key={tag}
              className={formData.tags.includes(tag) ? "selected" : ""}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </label>
          ))}
        </div>

        <input
          type="number"
          name="limit"
          value={formData.limit}
          placeholder="RSVP Limit"
          onChange={handleChange}
          required
          min={1}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEvent;
