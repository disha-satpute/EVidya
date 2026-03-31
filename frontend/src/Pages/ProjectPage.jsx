import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Projects.css";

export default function ProjectsPage() {

const fileInputRef = useRef(null);

const [projects, setProjects] = useState([]);

const [newProject, setNewProject] = useState({
project_title: "",
description: "",
technologies: "",
category: "",
project_level: "",
start_date: "",
end_date: "",
github_link: "",
demo_link: "",
video_link: "",
screenshot: null
});

useEffect(() => {
fetchProjects();
}, []);

const fetchProjects = async () => {

try {

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/projects/student",
{
headers: {
Authorization: `Bearer ${token}`
}
}
);

setProjects(res.data);

} catch (err) {
console.error(err);
}

};


/* ADD PROJECT */

const handleAdd = async () => {

if (!newProject.project_title || !newProject.technologies) {
toast.warning("Please fill required fields");
return;
}

try {

const token = localStorage.getItem("token");

const formData = new FormData();

formData.append("project_title", newProject.project_title);
formData.append("description", newProject.description);
formData.append("technologies", newProject.technologies);
formData.append("category", newProject.category);
formData.append("project_level", newProject.project_level);
formData.append("start_date", newProject.start_date);
formData.append("end_date", newProject.end_date);
formData.append("github_link", newProject.github_link);
formData.append("demo_link", newProject.demo_link);
formData.append("video_link", newProject.video_link);

if (newProject.screenshot) {
formData.append("screenshot", newProject.screenshot);
}

const res = await axios.post(
"http://localhost:5000/api/projects/add",
formData,
{
headers: {
"Content-Type": "multipart/form-data",
Authorization: `Bearer ${token}`
}
}
);

setProjects([res.data, ...projects]);

toast.success("Project added successfully 🚀");

setNewProject({
project_title: "",
description: "",
technologies: "",
category: "",
project_level: "",
start_date: "",
end_date: "",
github_link: "",
demo_link: "",
video_link: "",
screenshot: null
});

if (fileInputRef.current) {
fileInputRef.current.value = "";
}

} catch (err) {

toast.error("Something went wrong");

}

};


return (

<div className="projects-section">

<ToastContainer position="top-right" autoClose={3000} />

<h2>Projects</h2>


{/* PROJECT FORM */}

<div className="project-form">

<input
type="text"
placeholder="Project Title"
value={newProject.project_title}
onChange={(e) =>
setNewProject({ ...newProject, project_title: e.target.value })
}
/>

<input
type="text"
placeholder="Technologies Used"
value={newProject.technologies}
onChange={(e) =>
setNewProject({ ...newProject, technologies: e.target.value })
}
/>

<input
type="text"
placeholder="Category (Web / AI / Android)"
value={newProject.category}
onChange={(e) =>
setNewProject({ ...newProject, category: e.target.value })
}
/>

<select
value={newProject.project_level}
onChange={(e) =>
setNewProject({ ...newProject, project_level: e.target.value })
}
>
<option value="">Project Level</option>
<option>Academic</option>
<option>Personal</option>
<option>Internship</option>
<option>Open Source</option>
</select>

<input
type="date"
value={newProject.start_date}
onChange={(e) =>
setNewProject({ ...newProject, start_date: e.target.value })
}
/>

<input
type="date"
value={newProject.end_date}
onChange={(e) =>
setNewProject({ ...newProject, end_date: e.target.value })
}
/>

<input
type="text"
placeholder="GitHub Link"
value={newProject.github_link}
onChange={(e) =>
setNewProject({ ...newProject, github_link: e.target.value })
}
/>

<input
type="text"
placeholder="Live Demo Link"
value={newProject.demo_link}
onChange={(e) =>
setNewProject({ ...newProject, demo_link: e.target.value })
}
/>

<input
type="text"
placeholder="Video Demo Link"
value={newProject.video_link}
onChange={(e) =>
setNewProject({ ...newProject, video_link: e.target.value })
}
/>

<textarea
placeholder="Project Description"
value={newProject.description}
onChange={(e) =>
setNewProject({ ...newProject, description: e.target.value })
}
/>

<input
type="file"
ref={fileInputRef}
onChange={(e) =>
setNewProject({ ...newProject, screenshot: e.target.files[0] })
}
/>

<button onClick={handleAdd}>+ Add Project</button>

</div>


{/* PROJECT LIST */}

<div className="projects-grid">

{projects.length === 0 && (
<p className="empty-msg">No projects added yet</p>
)}

{projects.map((project) => (

<div key={project.id} className="project-card">

<h3>{project.project_title}</h3>

<p className="tech">{project.technologies}</p>

<p className="desc">{project.description}</p>

<div className="project-links">

{project.github_link && (
<a href={project.github_link} target="_blank" rel="noreferrer">
GitHub
</a>
)}

{project.demo_link && (
<a href={project.demo_link} target="_blank" rel="noreferrer">
Live Demo
</a>
)}

{project.video_link && (
<a href={project.video_link} target="_blank" rel="noreferrer">
Video
</a>
)}

</div>

</div>

))}

</div>

</div>

);

}