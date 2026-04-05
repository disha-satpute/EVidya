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
    full_name: "",
    institute_name: "",
    designation: "",
    qualification: "",
    expertise: "",
    branch: "",
    year: "",
    division: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFaculty(storedUser);

    fetchDashboardStats();
    fetchProfile(); // ✅ IMPORTANT
  }, []);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/faculty/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProfile(res.data);

    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  /* ================= FETCH STATS ================= */
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
      console.error(err);
    }
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SAVE ================= */
  const handleSaveProfile = async () => {
    try {

      await axios.put(
        "http://localhost:5000/api/faculty/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Profile updated successfully ✅");

      fetchProfile(); // refresh

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="faculty-dashboard">

      {/* ===== SIDEBAR ===== */}
      <div className="fixed-sidebar">
        <h2 className="sidebar-title">Faculty Dashboard</h2>

        <button onClick={() => setSidebarPage("home")}>Home</button>
        <button onClick={() => setSidebarPage("profile")}>Profile</button>
        <button onClick={() => navigate("/view-students")}>View Students</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">

        <header className="faculty-welcome">
          <h1>Welcome, {faculty?.full_name || "Faculty"} 👨‍🏫</h1>
          <p>Review student submissions</p>
        </header>

        {/* ================= PROFILE ================= */}
        {sidebarPage === "profile" && (
          <div className="profile-form-card">

            <h2>Faculty Profile</h2>

            <div className="profile-grid">

              <input name="full_name" value={profile.full_name || ""} onChange={handleChange} placeholder="Full Name" />
              <input name="institute_name" value={profile.institute_name || ""} onChange={handleChange} placeholder="Institute Name" />
              <input name="designation" value={profile.designation || ""} onChange={handleChange} placeholder="Designation" />
              <input name="qualification" value={profile.qualification || ""} onChange={handleChange} placeholder="Qualification" />
              <input name="expertise" value={profile.expertise || ""} onChange={handleChange} placeholder="Expertise" />

              <select name="branch" value={profile.branch || ""} onChange={handleChange}>
                <option value="">Select Branch</option>
                <option>Computer Engineering</option>
                <option>Information Technology</option>
                <option>Software Engineering</option>
              </select>

              <select name="year" value={profile.year || ""} onChange={handleChange}>
                <option value="">Select Year</option>
                <option>First Year</option>
                <option>Second Year</option>
                <option>Third Year</option>
                <option>Fourth Year</option>
              </select>

              <select name="division" value={profile.division || ""} onChange={handleChange}>
                <option value="">Select Division</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>

              <button className="faculty-btn faculty-purple" onClick={handleSaveProfile}>
                Save Profile
              </button>

            </div>
          </div>
        )}

        {/* ================= HOME ================= */}
        {sidebarPage === "home" && (
          <>
            <div className="faculty-stats">
              <div className="stat-card"><h3>Pending Certificates</h3><p>{stats.pendingCertificates}</p></div>
              <div className="stat-card"><h3>Pending Activities</h3><p>{stats.pendingActivities}</p></div>
              <div className="stat-card"><h3>Pending Projects</h3><p>{stats.pendingProjects}</p></div>
              <div className="stat-card"><h3>Pending Publications</h3><p>{stats.pendingPublications}</p></div>
              <div className="stat-card"><h3>Total Students</h3><p>{stats.totalStudents}</p></div>
            </div>

            <div className="faculty-tabs">
              <button onClick={() => setActiveTab("certificates")}>Certificates</button>
              <button onClick={() => setActiveTab("activities")}>Activities</button>
              <button onClick={() => setActiveTab("projects")}>Projects</button>
              <button onClick={() => setActiveTab("publications")}>Publications</button>
            </div>

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
