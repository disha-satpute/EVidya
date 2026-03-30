import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FacultyCertificates from "./facultyCertificates";
import FacultyActivities from "./facultyActivities";
import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("certificates");
  const [faculty, setFaculty] = useState(null);

  const [stats, setStats] = useState({
    pendingCertificates: 0,
    pendingActivities: 0,
    approvedThisMonth: 0,
    totalStudents: 0
  });

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFaculty(storedUser);

    fetchDashboardStats();

  }, []);

  const fetchDashboardStats = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/faculty/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setStats(res.data);

    } catch (err) {

      console.error("Dashboard stats error:", err);

    }

  };

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


      {/* Dashboard Counters */}

      <div className="faculty-stats">

        <div className="stat-card">
          <h3>Pending Certificates</h3>
          <p>{stats.pendingCertificates}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Activities</h3>
          <p>{stats.pendingActivities}</p>
        </div>

        <div className="stat-card">
          <h3>Approved This Month</h3>
          <p>{stats.approvedThisMonth}</p>
        </div>

        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>

      </div>


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