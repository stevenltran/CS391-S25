import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createevent.css";

// firebase
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
    foodType: "", 
    limit: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to create an event.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        limit: parseInt(formData.limit),
        rsvps: [],
        creator: user.uid,
        createdAt: new Date(), // ✅ timestamp
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
        <input 
          type="date" 
          name="date" 
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
