import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, Calendar, User, Folder, Award, BookOpen } from "lucide-react";
import "../styles/StudentDashboard.css";

import ActivitiesPage from "./ActivityPage";
import CertificatesPage from "./CertificatesPage";
import ProjectsPage from "./ProjectPage";
import ProfilePage from "./ProfilePage";
import PublicationPage from "./PublicationPage";   // ✅ ADD THIS

export default function StudentDashboard() {

  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [stats, setStats] = useState({
    certificates: 0,
    activities: 0,
    projects: 0,
    publications: 0,   // ✅ NEW
    points: 0
  });

const [showMenu, setShowMenu] = useState(false);  // ✅ add here

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    fetchStats();
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  /* ================= FETCH STATS ================= */

  const fetchStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const certRes = await axios.get(
        "http://localhost:5000/api/certificates/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const actRes = await axios.get(
        "http://localhost:5000/api/activities/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const projRes = await axios.get(
        "http://localhost:5000/api/projects/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pubRes = await axios.get(
        "http://localhost:5000/api/publications/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profileRes = await axios.get(
        "http://localhost:5000/api/students/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats({
        certificates: certRes.data.length,
        activities: actRes.data.length,
        projects: projRes.data.length,
        publications: pubRes.data.length,  // ✅ NEW
        points: profileRes.data.total_points || 0
      });

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/students/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <SidebarItem
          icon={<Home size={20} />}
          label="Home"
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />

        <SidebarItem
          icon={<User size={20} />}
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />

        <SidebarItem
          icon={<Award size={20} />}
          label="Certificates"
          active={activeTab === "certificates"}
          onClick={() => setActiveTab("certificates")}
        />

        <SidebarItem
          icon={<Calendar size={20} />}
          label="Activities"
          active={activeTab === "activities"}
          onClick={() => setActiveTab("activities")}
        />

        <SidebarItem
          icon={<Folder size={20} />}
          label="Projects"
          active={activeTab === "project"}
          onClick={() => setActiveTab("project")}
        />

        {/* ✅ NEW PUBLICATIONS TAB */}
        <SidebarItem
          icon={<BookOpen size={20} />}
          label="Publications"
          active={activeTab === "publications"}
          onClick={() => setActiveTab("publications")}
        />

      </div>

      {/* MAIN CONTENT */}
      <div className={`dashboard-content ${sidebarOpen ? "open" : ""}`}>
        <div className="student-dashboard">

          {/* HEADER */}
          <div className="header-card">

            <div className="header-top">
              <div>
                <h2 className="platform-title">Smart Student Hub</h2>
                <p className="subtitle">Digital Achievement Platform</p>
              </div>

              <div className="avatar-wrapper">
  <div
    className="avatar"
    onClick={() => setShowMenu(!showMenu)}
  >
    {user?.full_name?.charAt(0) || "S"}
  </div>

  {showMenu && (
    <div className="avatar-menu">
      <div
        className="menu-item"
        onClick={() => {
          setActiveTab("profile");
          setShowMenu(false);
        }}
      >
        View Profile
      </div>

      <div
        className="menu-item logout"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </div>
    </div>
  )}
</div>
            </div>

            <div className="welcome-card">

              <div className="welcome-info">
                <h3>
                  Welcome back, {profile?.full_name || "Student"} 👋
                </h3>

                <p>
                  <strong>Branch:</strong> {profile?.branch || ""} <br />
                  <strong>Year:</strong> {profile?.year || ""}
                </p>
              </div>

              <div className="cgpa-box">
                <p className="cgpa">{profile?.cgpa || "0.0"}</p>
                <span>Current CGPA</span>
              </div>

            </div>

          </div>

          {/* HOME DASHBOARD */}
          {activeTab === "home" && (
            <div className="stats-grid">

              <StatCard icon="🏆" label="Certificates" value={stats.certificates} />
              <StatCard icon="📅" label="Activities" value={stats.activities} />
              <StatCard icon="📂" label="Projects" value={stats.projects} />
              <StatCard icon="📄" label="Publications" value={stats.publications} />git
              <StatCard icon="🔥" label="Points" value={stats.points} />

            </div>
          )}

          {/* PAGES */}
          {activeTab === "profile" && (
            <ProfilePage
              refreshProfile={fetchProfile}
              refreshStats={fetchStats}
            />
          )}

          {activeTab === "certificates" && <CertificatesPage />}
          {activeTab === "activities" && <ActivitiesPage />}

          {activeTab === "project" && (
            <ProjectsPage refreshStats={fetchStats} />
          )}

          {/*  RENDER PUBLICATION PAGE */}
          {activeTab === "publications" && (
            <PublicationPage refreshStats={fetchStats} />
          )}

        </div>
      </div>
    </>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

/* Stat Card */
function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h2 className="stat-value">{value}</h2>
      <p className="stat-label">{label}</p>
    </div>
  );
}
