import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FacultyCertificates from "./facultyCertificates";
import FacultyActivities from "./facultyActivities";
import FacultyProjects from "./facultyProjects";
import FacultyPublications from "./facultyPublications";

import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("certificates");
  const [faculty, setFaculty] = useState(null);
  const [sidebarPage, setSidebarPage] = useState("home");

  const [stats, setStats] = useState({
    pendingCertificates: 0,
    pendingActivities: 0,
    pendingProjects: 0,
    pendingPublications: 0,
    totalStudents: 0
  });

  const [profile, setProfile] = useState({
    fullName: "",
    collegeId: "",
    designation: "",
    qualification: "",
    expertise: "",
    courseCode: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFaculty(storedUser);

    if (storedUser) {
      setProfile({
        fullName: storedUser.full_name || "",
        collegeId: "",
        designation: "",
        qualification: "",
        expertise: "",
        courseCode: ""
      });
    }

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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="faculty-dashboard">

      {/* ===== Sidebar ===== */}
      <div className="fixed-sidebar">
        <h2 className="sidebar-title">Faculty Dashboard</h2>

        <button onClick={() => setSidebarPage("home")}>
          Home
        </button>

        <button onClick={() => setSidebarPage("profile")}>
          Profile
        </button>

        <button onClick={() => navigate("/view-students")}>
          View Students
        </button>
        <button onClick={() => navigate("/view-students")}>
          Logout
        </button>
      </div>

      {/* ===== Content ===== */}
      <div className="dashboard-content">

        {/* Welcome */}
        <header className="faculty-welcome">
          <h1>Welcome, {faculty?.full_name || "Faculty"} 👨‍🏫</h1>
          <p>Review student submissions</p>
        </header>

        {/* ===== PROFILE PAGE ===== */}
        {sidebarPage === "profile" && (
          <div className="profile-form-card">
            <div className="profile-header">
  <h2>Faculty Profile</h2>

  <div className="profile-actions">
    <button className="edit-btn">Edit</button>
    <button className="delete-btn">Delete</button>
  </div>
</div>

            <div className="profile-grid">

              <input
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />

              <input
                name="collegeId"
                value={profile.collegeId}
                onChange={handleChange}
                placeholder="College ID Number"
              />

              <input
                name="designation"
                value={profile.designation}
                onChange={handleChange}
                placeholder="Designation"
              />

              <input
                name="qualification"
                value={profile.qualification}
                onChange={handleChange}
                placeholder="Qualification"
              />

              <input
                name="expertise"
                value={profile.expertise}
                onChange={handleChange}
                placeholder="Area of Teaching Expertise"
              />

              <input
                name="courseCode"
                value={profile.courseCode}
                onChange={handleChange}
                placeholder="Course Code"
              />

              <div className="file-upload">
                <label>Upload College ID Card Photo</label>
                <input type="file" />
              </div>



<div className="profile-submit">
  <button className="faculty-btn faculty-purple">
    Submit Profile
  </button>
</div>
            </div>
          </div>
        )}

        {/* ===== HOME DASHBOARD ===== */}
        {sidebarPage === "home" && (
          <>
            {/* Stats */}
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
                <h3>Pending Projects</h3>
                <p>{stats.pendingProjects}</p>
              </div>

              <div className="stat-card">
                <h3>Pending Publications</h3>
                <p>{stats.pendingPublications}</p>
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

              <button
                className={`faculty-tab ${activeTab === "projects" ? "faculty-active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                Projects
              </button>

              <button
                className={`faculty-tab ${activeTab === "publications" ? "faculty-active" : ""}`}
                onClick={() => setActiveTab("publications")}
              >
                Publications
              </button>

            </div>

            {/* Tab Content */}
            {activeTab === "certificates" && <FacultyCertificates />}
            {activeTab === "activities" && <FacultyActivities />}
            {activeTab === "projects" && <FacultyProjects />}
            {activeTab === "publications" && <FacultyPublications />}
          </>
        )}

      </div>
    </div>
  );
}