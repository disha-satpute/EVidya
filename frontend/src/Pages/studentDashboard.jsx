import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, Calendar, User, Folder, Award } from "lucide-react";
import "../styles/StudentDashboard.css";

import ActivitiesPage from "./ActivityPage";
import CertificatesPage from "./CertificatesPage";
import ProjectsPage from "./ProjectPage";
import ProfilePage from "./ProfilePage";
import AgentPage from "./Agent";

export default function StudentDashboard() {

const [activeTab, setActiveTab] = useState("home");
const [sidebarOpen, setSidebarOpen] = useState(false);
const [user, setUser] = useState(null);
const [profile,setProfile] = useState(null);

const [stats, setStats] = useState({
certificates: 0,
activities: 0,
projects: 0,
points: 0
});

useEffect(() => {

const storedUser = JSON.parse(localStorage.getItem("user"));
setUser(storedUser);

fetchStats();
fetchProfile();

}, []);


const fetchStats = async () => {

try{

const token = localStorage.getItem("token");

const certRes = await axios.get(
"http://localhost:5000/api/certificates/student",
{ headers:{ Authorization:`Bearer ${token}` } }
);

const actRes = await axios.get(
"http://localhost:5000/api/activities/student",
{ headers:{ Authorization:`Bearer ${token}` } }
);

const profileRes = await axios.get(
"http://localhost:5000/api/students/profile",
{ headers:{ Authorization:`Bearer ${token}` } }
);

setStats({
certificates: certRes.data.length,
activities: actRes.data.length,
projects: 0,
points: profileRes.data.total_points || 0
});

}catch(err){
console.error(err);
}

};


const fetchProfile = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/students/profile",
{ headers:{ Authorization:`Bearer ${token}` } }
);

setProfile(res.data);

}catch(err){
console.error(err);
}

};


return (
<>
<div className="sidebar-toggle" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</div>

<div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

<SidebarItem icon={<Home size={20}/>} label="Home"
active={activeTab==="home"} onClick={()=>setActiveTab("home")}/>

<SidebarItem icon={<User size={20}/>} label="Profile"
active={activeTab==="profile"} onClick={()=>setActiveTab("profile")}/>

<SidebarItem icon={<Award size={20}/>} label="Certificates"
active={activeTab==="certificates"} onClick={()=>setActiveTab("certificates")}/>

<SidebarItem icon={<Calendar size={20}/>} label="Activities"
active={activeTab==="activities"} onClick={()=>setActiveTab("activities")}/>

<SidebarItem icon={<User size={20}/>} label="Projects"
active={activeTab==="project"} onClick={()=>setActiveTab("project")}/>

<SidebarItem icon={<Folder size={20}/>} label="Portfolio"
active={activeTab==="portfolio"} onClick={()=>setActiveTab("portfolio")}/>

</div>


<div className={`dashboard-content ${sidebarOpen ? "open" : ""}`}>
<div className="student-dashboard">


<div className="header-card">

<div className="header-top">

<div>
<h2 className="platform-title">Smart Student Hub</h2>
<p className="subtitle">Digital Achievement Platform</p>
</div>

<div
className="avatar"
onClick={()=>setActiveTab("profile")}
>
{user?.full_name?.charAt(0) || "S"}
</div>

</div>


<div className="welcome-card">

<div className="welcome-info">

<h3>Welcome back, {profile?.full_name || "Student"} 👋</h3>

<p>
<strong>Branch:</strong> {profile?.branch || ""} <br/>
<strong>Year:</strong> {profile?.year || ""}
</p>

</div>

<div className="cgpa-box">
<p className="cgpa">{profile?.cgpa || "0.0"}</p>
<span>Current CGPA</span>
</div>

</div>

</div>


{activeTab==="home" && (

<div className="stats-grid">

<StatCard icon="🏆" label="Certificates" value={stats.certificates}/>
<StatCard icon="📅" label="Activities" value={stats.activities}/>
<StatCard icon="📂" label="Projects" value={stats.projects}/>
<StatCard icon="🔥" label="Points" value={stats.points}/>

</div>

)}

{activeTab==="profile" && (
  <ProfilePage
    refreshProfile={fetchProfile}
    refreshStats={fetchStats}
  />
)}
{activeTab==="certificates" && <CertificatesPage/>}

{activeTab==="activities" && <ActivitiesPage/>}

{activeTab==="project" && <ProjectsPage/>}

</div>
</div>
</>
);
}


function SidebarItem({icon,label,active,onClick}){

return(
<div className={`sidebar-item ${active ? "active" : ""}`} onClick={onClick}>
{icon}
<span>{label}</span>
</div>
);

}


function StatCard({icon,label,value}){

return(

<div className="stat-card">

<div className="stat-icon">{icon}</div>

<h2 className="stat-value">{value}</h2>

<p className="stat-label">{label}</p>

</div>

);

}