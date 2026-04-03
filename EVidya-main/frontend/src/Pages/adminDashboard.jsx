import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="adm-dashboard">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <h2 className="adm-sidebar-title">⚙ Admin Panel</h2>
        <nav>
          <ul className="adm-nav-list">
            <li className="adm-nav-item">📊 Dashboard</li>
            <li className="adm-nav-item">👩‍🎓 Manage Students</li>
            <li className="adm-nav-item">👨‍🏫 Manage Faculty</li>
            <li className="adm-nav-item">📚 Courses</li>
            <li className="adm-nav-item">📢 Announcements</li>
            <li className="adm-nav-item">⚡ Reports</li>
            <li className="adm-nav-item">🔒 Logout</li>
            {/* Back Button Below Logout */}
            <li
              className="adm-nav-item adm-back-btn"
              onClick={() => navigate("/")}
            >
              ⬅ Back to Home
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="adm-content">
        <header className="adm-header">
          <h1>Welcome, Admin 👋</h1>
          <p>Manage your institution efficiently</p>
        </header>

        {/* Cards Section */}
        <section className="adm-cards">
          <div className="adm-card">
            <h3>Total Students</h3>
            <p className="adm-number">1,240</p>
          </div>
          <div className="adm-card">
            <h3>Total Faculty</h3>
            <p className="adm-number">85</p>
          </div>
          <div className="adm-card">
            <h3>Active Courses</h3>
            <p className="adm-number">42</p>
          </div>
          <div className="adm-card">
            <h3>Pending Reports</h3>
            <p className="adm-number">7</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="adm-recent">
          <h2>📌 Recent Activity</h2>
          <ul className="adm-recent-list">
            <li className="adm-recent-item">New student registered: John Doe</li>
            <li className="adm-recent-item">Faculty uploaded results for CSE201</li>
            <li className="adm-recent-item">
              Announcement posted: "Midterm Exams Next Week"
            </li>
            <li className="adm-recent-item">
              Report submitted regarding system downtime
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}