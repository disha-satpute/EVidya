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
const [editingId, setEditingId] = useState(null);
const [editProject, setEditProject] = useState({});
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

  const handleDelete = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setProjects(projects.filter(p => p.id !== id));
    toast.success("Project deleted");
  } catch (err) {
    toast.error("Delete failed");
  }
};

const handleEditSave = async (id) => {
  try {

    const formData = new FormData();

    Object.keys(editProject).forEach((key) => {
      if (editProject[key]) {
        formData.append(key, editProject[key]);
      }
    });

    const res = await axios.put(
      `http://localhost:5000/api/projects/update/${id}`,   // ✅ FIXED
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setProjects(projects.map(p => p.id === id ? res.data : p));
    setEditingId(null);

    toast.success("Updated → Sent for approval 🚀");

  } catch (err) {
    toast.error("Update failed");
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

        <div className="date-field">
  <label>Start Date</label>
  <input
    type="date"
    value={newProject.start_date}
    onChange={(e)=>setNewProject({...newProject,start_date:e.target.value})}
  />
</div>

<div className="date-field">
  <label>End Date</label>
  <input
    type="date"
    value={newProject.end_date}
    onChange={(e)=>setNewProject({...newProject,end_date:e.target.value})}
  />
</div>

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

        <button onClick={handleAdd}>+ Submit Project</button>

      </div>

      {/* PROJECT LIST (LIKE ACTIVITY CARDS) */}
      {projects.map((project) => (

  <div className="activity-card" key={project.id}>

    {/* Action buttons */}
    <div className="card-actions">
      <button
        className="edit"
        onClick={()=>{
          setEditingId(project.id);
          setEditProject(project);
        }}
      >
        Edit
      </button>

      <button
        className="delete"
        onClick={()=>handleDelete(project.id)}
      >
        Delete
      </button>
    </div>

    {editingId === project.id ? (

      <div className="edit-form">

        <input
          value={editProject.project_title}
          onChange={(e)=>setEditProject({...editProject, project_title:e.target.value})}
        />

        <input
          value={editProject.technologies}
          onChange={(e)=>setEditProject({...editProject, technologies:e.target.value})}
        />

        <input
          value={editProject.category}
          onChange={(e)=>setEditProject({...editProject, category:e.target.value})}
        />

        <select
          value={editProject.project_level}
          onChange={(e)=>setEditProject({...editProject, project_level:e.target.value})}
        >
          <option>Academic</option>
          <option>Personal</option>
          <option>Internship</option>
          <option>Open Source</option>
        </select>

        <button onClick={()=>handleEditSave(project.id)}>Save</button>

      </div>

    ) : (

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

    )}

    <span className={`status ${(project.status || "pending").toLowerCase()}`}>
      {project.status || "Pending"}
    </span>

  </div>
))}

    </div>
  );
}
