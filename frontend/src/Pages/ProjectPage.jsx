import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/Projects.css";

export default function ProjectsPage(){

const [projects,setProjects] = useState([]);

useEffect(()=>{
fetchProjects();
},[]);

const fetchProjects = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/projects/student",
{headers:{Authorization:`Bearer ${token}`}}
);

setProjects(res.data);

}catch(err){
console.error(err);
}

};


return(

<div className="projects-container">

<h2 className="projects-title">My Projects</h2>

<div className="projects-grid">

{projects.map((project)=>(
<div key={project.id} className="project-card">

<h3>{project.project_title}</h3>

<p className="tech">
{project.technologies}
</p>

<p className="desc">
{project.description}
</p>

<div className="project-links">

{project.github_link && (
<a href={project.github_link} target="_blank">GitHub</a>
)}

{project.demo_link && (
<a href={project.demo_link} target="_blank">Live Demo</a>
)}

{project.video_link && (
<a href={project.video_link} target="_blank">Video</a>
)}

</div>

</div>
))}

</div>

</div>

);

}