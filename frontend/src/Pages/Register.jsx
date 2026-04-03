import React from "react";
import { motion } from "framer-motion";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="register-page">
      {/* Background Glow */}
      <div className="bg-orb orb-left"></div>
      <div className="bg-orb orb-right"></div>

      <motion.div
        className="register-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Choose Your Journey</h1>
        <p className="subtitle">
          Your role defines how you learn, teach, and grow on EVidya
        </p>

        <div className="role-wrapper">
          {/* Student */}
          <motion.div
            className="role-card student"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/student")}
          >
            <div className="icon">🎓</div>
            <h2>Student</h2>
            <p>
              Learn skills, collaborate on projects,
              and build your future.
            </p>
            <span className="tag">Learn • Build • Grow</span>
          </motion.div>

          {/* Connector */}
          <motion.div
            className="connector"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          {/* Faculty */}
          <motion.div
            className="role-card faculty"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/faculty")}
          >
            <div className="icon">🧑‍🏫</div>
            <h2>Faculty</h2>
            <p>
              Guide students, manage classes, mentor projects,
              and share knowledge.
            </p>
            <span className="tag">Teach • Mentor • Lead</span>
          </motion.div>
        </div>

        <div className="footer-note">
          You can switch roles later from your dashboard
        </div>
      </motion.div>
    </div>
  );
};

export default Register;