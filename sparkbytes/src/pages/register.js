import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./login.css";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Enforce @bu.edu email restriction
    if (!email.endsWith("@bu.edu")) {
      setError("Only BU email addresses are allowed.");
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth displayName
      await updateProfile(user, {
        displayName: name,
      });

      // Save user profile data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: "Student", // default
        claimedEvents: 0,
        createdEvents: 0,
        profilePicture: `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.uid}`, // default pic
      });

      alert("Account created successfully!");
      navigate("/profile", { state: { editing: true } });

    } catch (err) {
      console.error("Registration error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="register-button">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;