import { useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState({
    name: "Sarah",
    email: "sarah@bu.edu",
    role: "Student",
    claimedEvents: 3,
    createdEvents: 0,
    profilePicture: "https://i.pravatar.cc/150?img=3",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="profile-picture"
        />
        <h1>My Profile</h1>

        <div className="profile-info">
          <div>
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>
          <div>
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>
          <div>
            <label>Role</label>
            {isEditing ? (
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="Student">Student</option>
                <option value="Organizer">Organizer</option>
              </select>
            ) : (
              <p>{user.role}</p>
            )}
          </div>
          {user.role === "Student" && !isEditing && (
            <div>
              <label>Events Claimed</label>
              <p>{user.claimedEvents}</p>
            </div>
          )}
          {user.role === "Organizer" && !isEditing && (
            <div>
              <label>Events Created</label>
              <p>{user.createdEvents}</p>
            </div>
          )}
        </div>

        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <Link to="/" className="home-btn">← Back to Home</Link>
    </div>
  );
}

export default Profile;