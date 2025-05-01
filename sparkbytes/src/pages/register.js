import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./login.css";

function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Enforce @bu.edu email restriction
    if (!email.endsWith("@bu.edu")) {
      setError("Only BU email addresses are allowed.");
      return;
    }

    // Enforce @bu.edu email restriction
    if (!email.endsWith("@bu.edu")) {
      setError("Only BU email addresses are allowed.");
      return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Registered user:", user);

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
