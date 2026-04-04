import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/student_profile.css";

export default function ProfilePage({ refreshProfile, refreshStats }) {

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    prn: "",
    branch: "",
    year: "",
    cgpa: "",
    institute_name: "",
    division: "",
    github_link: "",
    linkedin_link: "",
    id_card: ""
  });

  const [idCard, setIdCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      Object.keys(profile).forEach((key) => {
        if (profile[key]) {
          formData.append(key, profile[key]);
        }
      });

      if (idCard) {
        formData.append("id_card", idCard);
      }

      await axios.put(
        "http://localhost:5000/api/students/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // ❌ DO NOT SET CONTENT TYPE
          }
        }
      );

      toast.success("Profile updated successfully 🎉");

      await fetchProfile(); // ✅ IMPORTANT

      if (refreshProfile) refreshProfile();
      if (refreshStats) refreshStats();

      setIsEditing(false);

    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="profile-header">
        <h2 className="profile-title">Student Profile</h2>

        <div className="profile-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      </div>

      <div className="profile-grid">

        <input
          name="full_name"
          value={profile.full_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <input
          name="email"
          value={profile.email || ""}
          disabled
        />

        <input
          name="prn"
          value={profile.prn || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <input
          name="cgpa"
          value={profile.cgpa || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {/* ✅ FIXED NAME */}
        <input
          name="institute_name"
          value={profile.institute_name || ""}
          onChange={handleChange}
          placeholder="Institute Name"
          disabled={!isEditing}
        />

        <select
          name="year"
          value={profile.year || ""}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="">Select Year</option>
          <option>First Year</option>
          <option>Second Year</option>
          <option>Third Year</option>
          <option>Fourth Year</option>
        </select>

        <select
          name="branch"
          value={profile.branch || ""}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="">Select Branch</option>
          <option>Computer Engineering</option>
          <option>Information Technology</option>
          <option>Software Engineering</option>
        </select>

        {/* ✅ FIXED NAME */}
        <input
          name="division"
          value={profile.division || ""}
          onChange={handleChange}
          placeholder="Division"
          disabled={!isEditing}
        />

        <input
          name="github_link"
          value={profile.github_link || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <input
          name="linkedin_link"
          value={profile.linkedin_link || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {/* FILE */}
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => setIdCard(e.target.files[0])}
          disabled={!isEditing}
        />

        {/* ✅ SHOW EXISTING FILE */}
        {profile.id_card && (
          <a
            href={`http://localhost:5000/${profile.id_card}`}
            target="_blank"
            rel="noreferrer"
          >
            View Uploaded ID Card
          </a>
        )}

      </div>

      <button
        className="profile-save"
        onClick={handleSave}
        disabled={loading || !isEditing}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

    </div>
  );
}
