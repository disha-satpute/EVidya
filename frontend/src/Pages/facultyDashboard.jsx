import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacultyCertificates from "./facultyCertificates";
import FacultyActivities from "./facultyActivities";
import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("certificates");
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFaculty(storedUser);
  }, []);

  return (
    <div className="faculty-dashboard">

      {/* Navbar */}
      <nav className="faculty-navbar">

        <div className="faculty-brand">
          EVidya <span className="faculty-role">Faculty Dashboard</span>
        </div>

        <div className="faculty-nav-actions">

          <button
            className="faculty-btn faculty-green"
            onClick={() => navigate("/")}
          >
            ⬅ Back to Home
          </button>

          <div className="faculty-profile-circle">
            {faculty?.full_name?.charAt(0) || "F"}
          </div>

        </div>

      </nav>

      {/* Welcome */}
      <header className="faculty-welcome">
        <h1>Welcome, {faculty?.full_name || "Faculty"} 👨‍🏫</h1>
        <p>Review student submissions</p>
      </header>

      {/* Tabs */}
      <div className="faculty-tabs">

        <button
          className={`faculty-tab ${activeTab === "certificates" ? "faculty-active" : ""}`}
          onClick={() => setActiveTab("certificates")}
        >
          Certificates
        </button>

        <button
          className={`faculty-tab ${activeTab === "activities" ? "faculty-active" : ""}`}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>

      </div>

      {/* Render Pages */}

      {activeTab === "certificates" && <FacultyCertificates />}

      {activeTab === "activities" && <FacultyActivities />}

    </div>
  );
}