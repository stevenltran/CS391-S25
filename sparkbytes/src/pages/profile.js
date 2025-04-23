import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./profile.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Profile() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.editing || false);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser(data);
        setFormData(data);
      } else {
        // Initialize profile with default values
        const defaultProfile = {
          name: "",
          email: currentUser.email,
          role: "Student",
          claimedEvents: 0,
          createdEvents: 0,
          profilePicture: "https://i.pravatar.cc/150?img=3",
        };
        await setDoc(userRef, defaultProfile);
        setUser(defaultProfile);
        setFormData(defaultProfile);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        profilePicture: downloadURL,
      }));
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      alert("Failed to upload image.");
    }
  };

  const handleSave = async () => {
    if (!currentUser || !formData) return;
  
    const userRef = doc(db, "users", currentUser.uid);
    const updatedData = {
      ...formData,
      email: currentUser.email, // ensure email stays consistent
    };
  
    console.log("Saving formData to Firestore:", updatedData);
  
    try {
      await setDoc(userRef, updatedData);
      setUser(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };
  
  if (!user || !formData) return <p>Loading profile...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <img
          src={isEditing ? formData.profilePicture : user.profilePicture}
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
            <p>{user.email}</p> {/* Email isn't editable */}
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

          {isEditing && (
            <div>
              <label>Upload Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePicUpload} />
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
