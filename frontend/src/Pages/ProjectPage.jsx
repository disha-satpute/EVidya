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

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/projects/student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProjects(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ADD PROJECT
  const handleAdd = async () => {

    if (!newProject.project_title || !newProject.technologies) {
      toast.warning("Please fill required fields!");
      return;
    }

    try {

      const formData = new FormData();

      Object.keys(newProject).forEach((key) => {
        if (newProject[key]) {
          formData.append(key, newProject[key]);
        }
      });

      const res = await axios.post(
        "http://localhost:5000/api/projects/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProjects([res.data, ...projects]);

      toast.success("Project submitted! Waiting for approval 🚀");

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

      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="activities-section">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Projects</h2>

      {/* FORM (same style as activity) */}
      <div className="cert-form">

        <input
          type="text"
          placeholder="Project Title"
          value={newProject.project_title}
          onChange={(e)=>setNewProject({...newProject,project_title:e.target.value})}
        />

        <input
          type="text"
          placeholder="Technologies Used"
          value={newProject.technologies}
          onChange={(e)=>setNewProject({...newProject,technologies:e.target.value})}
        />

        <input
          type="text"
          placeholder="Category (Web / AI / App)"
          value={newProject.category}
          onChange={(e)=>setNewProject({...newProject,category:e.target.value})}
        />

        <select
          value={newProject.project_level}
          onChange={(e)=>setNewProject({...newProject,project_level:e.target.value})}
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
          onChange={(e)=>setNewProject({...newProject,start_date:e.target.value})}
        />

        <input
          type="date"
          value={newProject.end_date}
          onChange={(e)=>setNewProject({...newProject,end_date:e.target.value})}
        />

        <input
          type="text"
          placeholder="GitHub Link"
          value={newProject.github_link}
          onChange={(e)=>setNewProject({...newProject,github_link:e.target.value})}
        />

        <input
          type="text"
          placeholder="Live Demo Link"
          value={newProject.demo_link}
          onChange={(e)=>setNewProject({...newProject,demo_link:e.target.value})}
        />

        <input
          type="text"
          placeholder="Video Demo Link"
          value={newProject.video_link}
          onChange={(e)=>setNewProject({...newProject,video_link:e.target.value})}
        />

        <textarea
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e)=>setNewProject({...newProject,description:e.target.value})}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e)=>setNewProject({...newProject,screenshot:e.target.files[0]})}
        />

        <button onClick={handleAdd}>+ Submit Project</button>

      </div>

      {/* PROJECT LIST (LIKE ACTIVITY CARDS) */}
      {projects.map((project) => (

        <div className="activity-card" key={project.id}>

          <div>

            <h4>{project.project_title}</h4>

            <p>
              {project.technologies} • {project.category}
            </p>

            <p className="time">
              {project.start_date && new Date(project.start_date).toLocaleDateString()}
            </p>

            {project.description && (
              <p>{project.description.slice(0, 60)}</p>
            )}

            {/* LINKS */}
            <div className="project-links">

              {project.github_link && (
                <a href={project.github_link} target="_blank">GitHub</a>
              )}

              {project.demo_link && (
                <a href={project.demo_link} target="_blank">Live</a>
              )}

              {project.video_link && (
                <a href={project.video_link} target="_blank">Video</a>
              )}

              {project.screenshot && (
                <a
                  href={`http://localhost:5000/${project.screenshot}`}
                  target="_blank"
                >
                  View Proof
                </a>
              )}

            </div>

          </div>

          {/* STATUS (IMPORTANT) */}
          <span className={`status ${(project.status || "pending").toLowerCase()}`}>
            {project.status || "Pending"}
          </span>

        </div>

      ))}

    </div>
  );
}
