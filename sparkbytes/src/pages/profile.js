import "./profile.css";

function Profile() {
  // placeholder user data replace with actual backend data later
  const user = {
    name: "Sarah",
    email: "sarah@bu.edu",
    role: "Student Or Organizer", 
    profilePicture: "https://i.pravatar.cc/150?img=3",
    claimedEvents: 3,
    createdEvents: 0,
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p className="user-role">{user.role}</p>

        {user.role === "Student" && (
          <p>Events Claimed: {user.claimedEvents}</p>
        )}

        {user.role === "Organizer" && (
          <p>Events Created: {user.createdEvents}</p>
        )}

        <button className="edit-button">Edit Profile</button>
      </div>
    </div>
  );
}

export default Profile;