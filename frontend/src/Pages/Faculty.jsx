import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Faculty.css";
import facultyGif from "../assets/faculty-illustration.gif";

const FacultyProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/faculty/register",
        formData
      );

      // Save token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", "Faculty");

      alert("Faculty registered successfully 🎉");

      navigate("/faculty-dashboard");

    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User already registered. Please login.") {
        alert("User already registered. Please login.");
        navigate("/signin");
      } else {
        setError(message || "Registration failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="faculty-page">
      <div className="faculty-glow purple"></div>
      <div className="faculty-glow blue"></div>

      <motion.div
        className="faculty-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT – FORM */}
        <div className="faculty-form">
          <h1>Complete Faculty Profile</h1>
          <p className="subtitle">
            Build a professional academic identity 👩‍🏫
          </p>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>College</label>
            <input
              type="text"
              name="college"
              placeholder="Enter institution name"
              value={formData.college}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>

          </form>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="faculty-image">
          <img src={facultyGif} alt="Faculty Illustration" />
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyProfile;