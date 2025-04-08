import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createevent.css";

function CreateEvent() {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // save event to localStorage for now (temporary storage)
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = [...storedEvents, { ...formData, rsvps: [] }];
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    

    // redirect to event listing page
    navigate("/events");
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

export default CreateEvent;
