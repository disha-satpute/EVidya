import React, { useState } from "react";
import { Home, Calendar, User, Folder, Flame, Award } from "lucide-react";
import "../styles/StudentDashboard.css";
import ActivitiesPage from "./ActivityPage";
import AgentPage from "./Agent";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar toggle state

  return (
    <>
      {/* Toggle Button */}
      <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <SidebarItem icon={<Home size={20} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <SidebarItem icon={<Award size={20} />} label="Certificates" active={activeTab === "certificates"} onClick={() => setActiveTab("certificates")} />
        <SidebarItem icon={<Calendar size={20} />} label="Activities" active={activeTab === "activities"} onClick={() => setActiveTab("activities")} />
        <SidebarItem icon={<User size={20} />} label="Agent" active={activeTab === "agent"} onClick={() => setActiveTab("agent")} />
        <SidebarItem icon={<Folder size={20} />} label="Portfolio" active={activeTab === "portfolio"} onClick={() => setActiveTab("portfolio")} />
        
      </div>

      {/* Main Content */}
      <div className={`dashboard-content ${sidebarOpen ? "open" : ""}`}>
        <div className="student-dashboard">
          {/* Header */}
          <div className="header-card">
            <div className="header-top">
              <div>
                <h2 className="platform-title">Smart Student Hub</h2>
                <p className="subtitle">Digital Achievement Platform</p>
              </div>
              <div className="avatar">JS</div>
            </div>
            <div className="welcome-card">
              <div>
                <h3>Welcome back, John! 👋</h3>
                <p>
                  Computer Science Engineering <br />
                  Final Year · Roll: CSE2021001
                </p>
              </div>
              <div className="cgpa-box">
                <p className="cgpa">8.7</p>
                <span>Current CGPA</span>
              </div>
            </div>
          </div>

          {/* Conditional Rendering */}
          {activeTab === "home" && (
            <>
              <div className="stats-grid">
                <div onClick={() => setActiveTab("certificates")}>
                  <StatCard icon="✅" label="Certifications" value="24" />
                </div>
                <StatCard icon="📅" label="Events Attended" value="12" />
                <StatCard icon="📂" label="Projects" value="8" />
                <StatCard icon="🔥" label="Activity Points" value="156" />
              </div>

              <div className="activities-section">
                <h2>Recent Activities</h2>
                <ActivityCard title="AWS Cloud Practitioner" status="Approved" time="2 days ago" />
                <ActivityCard title="National Hackathon" status="Pending" time="1 week ago" />
              </div>
            </>
          )}

          {activeTab === "certificates" && <CertificatesPage />}
          {activeTab === "activities" && <ActivitiesPage />}
          {activeTab === "agent" && <AgentPage />}
          {activeTab === "portfolio" && <div>Portfolio page coming soon...</div>}
          
        </div>
      </div>
    </>
  );
}

// Sidebar Item
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div className={`sidebar-item ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Certificates Page
function CertificatesPage() {
  const [certificates, setCertificates] = useState([
    { id: 1, name: "AWS Cloud Practitioner", issuer: "Amazon", date: "2023-08-20", status: "Approved" },
    { id: 2, name: "Azure Fundamentals", issuer: "Microsoft", date: "2023-09-12", status: "Pending" },
  ]);

  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "", status: "Pending" });

  const handleAdd = () => {
    if (!newCert.name || !newCert.issuer || !newCert.date) return;
    setCertificates([...certificates, { ...newCert, id: Date.now() }]);
    setNewCert({ name: "", issuer: "", date: "", status: "Pending" });
  };

  return (
    <div className="activities-section">
      <h2>Certificates</h2>

      <div className="cert-form">
        <input type="text" placeholder="Certificate Name" value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} />
        <input type="text" placeholder="Issuer" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} />
        <input type="date" value={newCert.date} onChange={(e) => setNewCert({ ...newCert, date: e.target.value })} />
        <select value={newCert.status} onChange={(e) => setNewCert({ ...newCert, status: e.target.value })}>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={handleAdd}>+ Add</button>
      </div>

      <div className="cert-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Issuer</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.name}</td>
                <td>{cert.issuer}</td>
                <td>{cert.date}</td>
                <td>
                  <span className={`status ${cert.status.toLowerCase()}`}>{cert.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// StatCard
function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="icon">{icon}</span>
      <p className="value">{value}</p>
      <p className="label">{label}</p>
    </div>
  );
}

// ActivityCard
function ActivityCard({ title, status, time }) {
  return (
    <div className="activity-card">
      <h4>{title}</h4>
      <p className="time">{time}</p>
      <span className={`status ${status.toLowerCase()}`}>{status}</span>
    </div>
  );
}
