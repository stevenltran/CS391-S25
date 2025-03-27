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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save event to localStorage for now (temporary storage)
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = [...storedEvents, formData];
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Redirect to event listing page
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
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
