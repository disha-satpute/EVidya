import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FacultyProjects() {

  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setProjects(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= COUNTS ================= */

  const pendingCount = projects.filter(p => p.status === "Pending").length;
  const approvedCount = projects.filter(p => p.status === "Approved").length;
  const rejectedCount = projects.filter(p => p.status === "Rejected").length;

  /* ================= FILTER ================= */

  const filteredProjects = projects.filter((proj) => {
    if (filter === "pending") return proj.status === "Pending";
    if (filter === "approved") return proj.status === "Approved";
    if (filter === "rejected") return proj.status === "Rejected";
    return true;
  });

  /* ================= ACTION ================= */

  const handleStatusUpdate = async (id, status) => {

    try {

      await axios.put(
        `http://localhost:5000/api/projects/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success(`Project ${status}`);
      fetchProjects();

    } catch (err) {

      console.error(err);
      toast.error("Action failed");

    }

  };

  return (

    <div className="faculty-reviews-card">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>💻 Project Reviews</h2>

      {/* ================= FILTER BUTTONS ================= */}

      <div className="faculty-filters">

        <button
          className={`faculty-filter ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending Projects ({pendingCount})
        </button>

        <button
          className={`faculty-filter ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved Projects ({approvedCount})
        </button>

        <button
          className={`faculty-filter ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected Projects ({rejectedCount})
        </button>

        <button
          className={`faculty-filter ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({projects.length})
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <table className="faculty-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Project</th>
            <th>Technologies</th>
            <th>Category</th>
            <th>Level</th>
            <th>Links</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No projects found
              </td>
            </tr>
          ) : (

            filteredProjects.map((project) => (

              <tr key={project.id}>

                <td>{project.full_name}</td>

                <td>
                  <strong>{project.project_title}</strong>
                  <br />
                  <small>{project.description}</small>
                </td>

                <td>{project.technologies}</td>

                <td>{project.category}</td>

                <td>{project.project_level}</td>

                <td>

                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}

                  {" "}

                  {project.demo_link && (
                    <a href={project.demo_link} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}

                  {" "}

                  {project.video_link && (
                    <a href={project.video_link} target="_blank" rel="noreferrer">
                      Video
                    </a>
                  )}

                </td>

                {/* STATUS */}
                <td>
                  <span className={`status ${(project.status || "pending").toLowerCase()}`}>
                    {project.status || "Pending"}
                  </span>
                </td>

                {/* ACTION */}
                <td>

                  {project.status === "Pending" ? (
                    <>
                      <button
                        className="faculty-btn faculty-small faculty-green"
                        onClick={() => handleStatusUpdate(project.id, "Approved")}
                      >
                        ✔
                      </button>

                      <button
                        className="faculty-btn faculty-small faculty-red"
                        onClick={() => handleStatusUpdate(project.id, "Rejected")}
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    "-"
                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}
