import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ActivitiesPage() {

  const fileInputRef = useRef(null);

  const [activities, setActivities] = useState([]);

  const [newActivity, setNewActivity] = useState({
    activity_title: "",
    activity_type: "",
    organization: "",
    activity_date: "",
    description: "",
    proof_file: null
  });

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/activities/student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setActivities(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // Load when page opens
  useEffect(() => {
    fetchActivities();
  }, []);


  const handleAdd = async () => {

    if (!newActivity.activity_title || !newActivity.activity_type || !newActivity.organization || !newActivity.activity_date) {
      toast.warning("Please fill all required fields!");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("activity_title", newActivity.activity_title);
      formData.append("activity_type", newActivity.activity_type);
      formData.append("organization", newActivity.organization);
      formData.append("activity_date", newActivity.activity_date);
      formData.append("description", newActivity.description);

      if (newActivity.proof_file) {
        formData.append("proof_file", newActivity.proof_file);
      }

      const res = await axios.post(
        "http://localhost:5000/api/activities/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setActivities([...activities, res.data]);

      toast.success("Activity submitted successfully! Waiting for approval.");

      setNewActivity({
        activity_title: "",
        activity_type: "",
        organization: "",
        activity_date: "",
        description: "",
        proof_file: null
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {

      toast.error("Something went wrong");

    }

  };

  return (
    <div className="activities-section">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Activities</h2>

      <div className="cert-form">

        <input
          type="text"
          placeholder="Activity Title"
          value={newActivity.activity_title}
          onChange={(e)=>setNewActivity({...newActivity,activity_title:e.target.value})}
        />

        <select
          value={newActivity.activity_type}
          onChange={(e)=>setNewActivity({...newActivity,activity_type:e.target.value})}
        >
          <option value="">Activity Type</option>
          <option>Hackathon</option>
          <option>Workshop</option>
          <option>Seminar</option>
          <option>Competition</option>
          <option>Internship</option>
          <option>Volunteering</option>
        </select>

        <input
          type="text"
          placeholder="Organization / Host"
          value={newActivity.organization}
          onChange={(e)=>setNewActivity({...newActivity,organization:e.target.value})}
        />

        <input
          type="date"
          value={newActivity.activity_date}
          onChange={(e)=>setNewActivity({...newActivity,activity_date:e.target.value})}
        />

        <input
          type="text"
          placeholder="Description"
          value={newActivity.description}
          onChange={(e)=>setNewActivity({...newActivity,description:e.target.value})}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e)=>setNewActivity({...newActivity,proof_file:e.target.files[0]})}
        />

        <button onClick={handleAdd}>+ Add</button>

      </div>

      {activities.map((activity) => (

        <div className="activity-card" key={activity.id}>

          <div>

            <h4>{activity.activity_title}</h4>

            <p>{activity.activity_type} • {activity.organization}</p>

            <p className="time">
              {new Date(activity.activity_date).toLocaleDateString()}
            </p>

            {activity.description && (
              <p>{activity.description.slice(0,50)}</p>
            )}

            {activity.proof_file && (
              <a
                href={`http://localhost:5000/${activity.proof_file}`}
                target="_blank"
                rel="noreferrer"
              >
                View Proof
              </a>
            )}

          </div>

          <span className={`status ${(activity.status || "pending").toLowerCase()}`}>
            {activity.status || "Pending"}
          </span>

        </div>

      ))}

    </div>
  );
}