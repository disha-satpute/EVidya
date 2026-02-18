import React, { useState } from "react";
import "../styles/ActivityPage.css"; // Namespaced CSS

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([
    { id: 1, title: "AWS Cloud Practitioner", status: "Approved", time: "2 days ago" },
    { id: 2, title: "National Hackathon", status: "Pending", time: "1 week ago" },
  ]);

  const [newActivity, setNewActivity] = useState({
    title: "",
    status: "Pending",
    time: "",
  });

  const handleAdd = () => {
    if (!newActivity.title || !newActivity.time) return;
    setActivities([...activities, { ...newActivity, id: Date.now() }]);
    setNewActivity({ title: "", status: "Pending", time: "" });
  };

  const handleDelete = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  return (
    <div className="activities-page">
      <h2>Activities</h2>

      {/* Add Activity Form */}
      <div className="activity-form">
        <input
          type="text"
          placeholder="Activity Title"
          value={newActivity.title}
          onChange={(e) =>
            setNewActivity({ ...newActivity, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Time (e.g., 2 days ago)"
          value={newActivity.time}
          onChange={(e) =>
            setNewActivity({ ...newActivity, time: e.target.value })
          }
        />
        <select
          value={newActivity.status}
          onChange={(e) =>
            setNewActivity({ ...newActivity, status: e.target.value })
          }
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={handleAdd}>+ Add</button>
      </div>

      {/* Activities List */}
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div>
              <h4>{activity.title}</h4>
              <p className="time">{activity.time}</p>
            </div>
            <div className="action-group">
              <span className={`status ${activity.status.toLowerCase()}`}>
                {activity.status}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(activity.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
