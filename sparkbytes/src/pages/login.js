import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

// firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    const { email, password } = formData;
  
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      alert("Login successful!");
      navigate("/events");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError("Enter your email to reset password");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent!");
    } catch (err) {
      console.error("Reset error:", err.message);
      setError("Failed to send reset email. Try again.");
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
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
          <button type="submit" className="login-button">Login</button>

          <button type="button" onClick={handleResetPassword} className="forgot-password-button">
            Forgot Password?
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <a href="/register" className="register-button">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;