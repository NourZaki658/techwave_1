import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import "./DoctorLogin.css";

import { login } from "../api/auth";

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
   const user = await login(email, password, "doctor");

    localStorage.setItem("doctorLoggedIn", JSON.stringify({
  id: user.userId,
  email: user.email || email,
  name: "Doctor",
  specialty: "Doctor",
  loginTime: new Date().toISOString(),
}));

    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Login failed.");
  }
};

  return (
    <div className="register-container">
      <div className="left">
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5" alt="doctor" />
      </div>

      <div className="right">
        <div className="top-bar">
          <Link to="/" className="back">
            <FaArrowLeft /> Homepage
          </Link>
          <div className="logo">
            <FaHeart /> MedTrack
          </div>
        </div>

        <h2>Login as a Doctor</h2>
        <p className="subtitle">Welcome back 👋</p>

        {error && <div style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

        <form className="form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address *" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password *" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="submit">Login</button>

          <p className="login-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/doctor-register")}>Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;