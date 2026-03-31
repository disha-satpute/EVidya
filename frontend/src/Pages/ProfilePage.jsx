import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

await axios.put(
"http://localhost:5000/api/students/profile",
profile,
{ headers:{ Authorization:`Bearer ${token}` } }
);

toast.success("Profile updated successfully 🎉");

/* REFRESH FORM DATA */
fetchProfile();

/* REFRESH DASHBOARD DATA */
if(refreshProfile) refreshProfile();
if(refreshStats) refreshStats();

}catch(err){

toast.error("Update failed");

}finally{

setLoading(false);

}

};


return(

<div className="profile-container">

<ToastContainer position="top-right" autoClose={3000}/>

<h2 className="profile-title">Student Profile</h2>

<div className="profile-grid">

<input
name="full_name"
value={profile.full_name || ""}
onChange={handleChange}
placeholder="Full Name"
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
/>

<input
name="branch"
value={profile.branch || ""}
onChange={handleChange}
placeholder="Branch"
/>

<input
name="year"
value={profile.year || ""}
onChange={handleChange}
placeholder="Year"
/>

<input
name="cgpa"
value={profile.cgpa || ""}
onChange={handleChange}
placeholder="Current CGPA"
/>

<input
name="github_link"
value={profile.github_link || ""}
onChange={handleChange}
placeholder="GitHub Link"
/>

<input
name="linkedin_link"
value={profile.linkedin_link || ""}
onChange={handleChange}
placeholder="LinkedIn Link"
/>

</div>

<button
className="profile-save"
onClick={handleSave}
disabled={loading}
>
{loading ? "Updating..." : "Update Profile"}
</button>

</div>

);

}