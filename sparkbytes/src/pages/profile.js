import { useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";

function Profile() {
  const [user] = useState({
    name: "Sarah",
    email: "sarah@bu.edu",
    role: "Student",
    claimedEvents: 3,
    createdEvents: 0,
    profilePicture: "https://i.pravatar.cc/150?img=3",
  });

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
            <p>{user.name}</p>
          </div>
          <div>
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label>Role</label>
            <p>{user.role}</p>
          </div>
          {user.role === "Student" && (
            <div>
              <label>Events Claimed</label>
              <p>{user.claimedEvents}</p>
            </div>
          )}
          {user.role === "Organizer" && (
            <div>
              <label>Events Created</label>
              <p>{user.createdEvents}</p>
            </div>
          )}
        </div>

        <button className="edit-btn">Edit Profile</button>
      </div>

     
      <Link to="/" className="home-btn">← Back to Home</Link>
    </div>
  );
}

export default Profile;