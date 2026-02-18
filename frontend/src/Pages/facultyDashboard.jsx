import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="faculty-dashboard">
      {/* Navbar */}
      <nav className="faculty-navbar">
        <div className="faculty-brand">
          EVidya <span className="faculty-role">Faculty Dashboard</span>
        </div>
        <div className="faculty-nav-actions">
          <button className="faculty-btn">⬇ Export Reports</button>
          <button className="faculty-btn faculty-purple">📊 Analytics</button>
          {/* Back to Home Button */}
          <button 
            className="faculty-btn faculty-green" 
            onClick={() => navigate("/")}
          >
            ⬅ Back to Home
          </button>
          <div className="faculty-profile-circle">DRK</div>
        </div>
      </nav>

      {/* Welcome Section */}
      <header className="faculty-welcome">
        <h1>Welcome, Dr. Rajesh 👨‍🏫</h1>
        <p>Review student achievements and generate reports</p>
      </header>

      {/* Stats Cards */}
      <section className="faculty-stats-grid">
        <div className="faculty-stat-card">
          <h3>Total Students</h3>
          <p className="faculty-number">1247</p>
          <span className="faculty-meta">Active in your courses</span>
        </div>
        <div className="faculty-stat-card">
          <h3>Pending Reviews</h3>
          <p className="faculty-number faculty-yellow">1</p>
          <span className="faculty-meta">Awaiting your approval</span>
        </div>
        <div className="faculty-stat-card">
          <h3>This Month</h3>
          <p className="faculty-number faculty-green">47</p>
          <span className="faculty-meta">Achievements reviewed</span>
        </div>
        <div className="faculty-stat-card">
          <h3>Avg Response</h3>
          <p className="faculty-number faculty-purple">2.4 days</p>
          <span className="faculty-meta">Review time</span>
        </div>
      </section>

      {/* Tabs */}
      <div className="faculty-tabs">
        <button className="faculty-tab faculty-active">Pending Approvals (1)</button>
        <button className="faculty-tab">Recent Reviews</button>
        <button className="faculty-tab">Analytics</button>
      </div>

      {/* Pending Approvals Table */}
      <div className="faculty-reviews-card">
        <h2>⏳ Pending Achievement Reviews</h2>
        <p>Student achievements awaiting your verification</p>
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Arjun Sharma</strong>
                <br />
                <small>Student ID: 1</small>
              </td>
              <td>
                <strong>Hackathon Winner - TechFest 2023</strong>
                <br />
                <small>
                  First place in inter-college hackathon with AI-based solution
                </small>
              </td>
              <td><span className="faculty-tag">Competition</span></td>
              <td>22/10/2023</td>
              <td className="faculty-points">200</td>
              <td className="faculty-actions">
                <button className="faculty-btn faculty-small faculty-green">✔</button>
                <button className="faculty-btn faculty-small faculty-red">✖</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}