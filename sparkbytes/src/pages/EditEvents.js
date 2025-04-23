import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./createevent.css";

function EditEvent() {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert("Event not found.");
          navigate("/manageevents");
        }
      } catch (error) {
        console.error("Error loading event:", error);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        ...formData,
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
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select
          name="foodType"
          value={formData.foodType}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Food Type --</option>
          <option value="Vegan">Vegan</option>
          <option value="Halal">Halal</option>
          <option value="Kosher">Kosher</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Regular">Regular</option>
        </select>

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