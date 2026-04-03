import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/student_profile.css";

export default function ProfilePage({ refreshProfile, refreshStats }) {

const [loading,setLoading] = useState(false);

const [profile,setProfile] = useState({
full_name:"",
email:"",
prn:"",
branch:"",
year:"",
cgpa:"",
github_link:"",
linkedin_link:""
});

/* ✅ NEW STATE FOR FILE */
const [idCard, setIdCard] = useState(null);

const [isEditing, setIsEditing] = useState(false);

useEffect(()=>{
fetchProfile();
},[]);

const fetchProfile = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/students/profile",
{headers:{Authorization:`Bearer ${token}`}}
);

setProfile(res.data);

}catch(err){
console.error(err);
}

};

const handleChange = (e)=>{
setProfile({...profile,[e.target.name]:e.target.value});
};

const handleSave = async () => {

try{

setLoading(true);

const token = localStorage.getItem("token");

/* ✅ USE FORMDATA */
const formData = new FormData();

/* append profile fields */
Object.keys(profile).forEach((key)=>{
  formData.append(key, profile[key]);
});

/* append file */
if(idCard){
  formData.append("id_card", idCard);
}

await axios.put(
"http://localhost:5000/api/students/profile",
formData,
{
headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"multipart/form-data"
}
}
);

toast.success("Profile updated successfully 🎉");

/* REFRESH FORM DATA */
fetchProfile();

/* REFRESH DASHBOARD DATA */
if(refreshProfile) refreshProfile();
if(refreshStats) refreshStats();

setIsEditing(false);

}catch(err){

toast.error("Update failed");

}finally{

setLoading(false);

}

};

return (

<div className="profile-container">

<ToastContainer position="top-right" autoClose={3000}/>

<div className="profile-header">
  <h2 className="profile-title">Student Profile</h2>

  <div className="profile-actions">
    <button className="edit-btn" onClick={()=>setIsEditing(true)}>Edit</button>
    <button className="delete-btn" onClick={()=>setProfile({
      full_name:"",
      email:profile.email,
      prn:"",
      branch:"",
      year:"",
      cgpa:"",
      github_link:"",
      linkedin_link:""
    })}>Delete</button>
  </div>
</div>

<div className="profile-grid">

<input
name="full_name"
value={profile.full_name || ""}
onChange={handleChange}
placeholder="Full Name"
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
placeholder="PRN"
disabled={!isEditing}
/>

<input
name="cgpa"
value={profile.cgpa || ""}
onChange={handleChange}
placeholder="Current CGPA"
disabled={!isEditing}
/>

<input
name="Institute_Name"
value={profile.Institute_Name || ""}
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
  <option value="">Select Branch / Course</option>
  <option>Computer Engineering</option>
  <option>Information Technology</option>
  <option>Software Engineering</option>
  <option>AIDS Engineering</option>
  <option>Mechanical Engineering</option>
  <option>Civil Engineering</option>
  <option>Electronics Engineering</option>
  <option>Electrical Engineering</option>
  <option>Chemical Engineering</option>
</select>

<input
name="Division"
value={profile.Division || ""}
onChange={handleChange}
placeholder="Division"
disabled={!isEditing}
/>

<input
name="github_link"
value={profile.github_link || ""}
onChange={handleChange}
placeholder="GitHub Link"
disabled={!isEditing}
/>

<input
name="linkedin_link"
value={profile.linkedin_link || ""}
onChange={handleChange}
placeholder="LinkedIn Link"
disabled={!isEditing}
/>

{/* ✅ NEW FILE INPUT */}
<div className="file-upload-wrapper">
  <label className="file-label">Upload College ID Card</label>

  <div className="file-input-row">
    <input
      type="file"
      id="idCardUpload"
      accept=".png,.jpg,.jpeg,.pdf"
      onChange={(e)=>{
        const file = e.target.files[0];

        if(file){
          const allowedTypes = [
            "image/png",
            "image/jpeg",
            "application/pdf"
          ];

          if(!allowedTypes.includes(file.type)){
            toast.error("Only PNG, JPG, JPEG, PDF files are allowed");
            return;
          }

          setIdCard(file);
        }
      }}
      disabled={!isEditing}
    />

    
  </div>
</div>

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