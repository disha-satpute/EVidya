import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicationPage() {

  const [publications, setPublications] = useState([]);

  const [newPub, setNewPub] = useState({
    title: "",
    publication_type: "",
    journal_name: "",
    publisher: "",
    publication_date: "",
    doi_link: "",
    paper_link: "",
    certificate_link: ""
  });
const [editingId, setEditingId] = useState(null);
const [editPub, setEditPub] = useState({});
  /* ================= FETCH ================= */

  const fetchPublications = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/publications/student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setPublications(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    fetchPublications();
  }, []);

  /* ================= ADD ================= */

  const handleAdd = async () => {

    if (!newPub.title || !newPub.publication_type) {
      toast.warning("Please fill required fields!");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/publications/add",
        newPub,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setPublications([res.data, ...publications]);

      toast.success("Publication submitted! Waiting for approval 📄");

      setNewPub({
        title: "",
        publication_type: "",
        journal_name: "",
        publisher: "",
        publication_date: "",
        doi_link: "",
        paper_link: "",
        certificate_link: ""
      });

    } catch (err) {
      toast.error("Something went wrong");
    }

  };

  /* ================= UI ================= */
// ===== DELETE =====
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/publications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setPublications(publications.filter((p) => p.id !== id));
    toast.success("Publication deleted");
  } catch (err) {
    toast.error("Delete failed");
  }
};

// ===== SAVE EDIT =====
const handleEditSave = async (id) => {
  try {
    await axios.put(
      `http://localhost:5000/api/publications/update/${id}`,
      editPub,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setEditingId(null);
    fetchPublications();
    toast.success("Publication updated");
  } catch (err) {
    toast.error("Update failed");
  }
};
  return (

    <div className="activities-section">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>📄 Publications</h2>

      {/* FORM */}
      <div className="cert-form">

        <input
          type="text"
          placeholder="Paper Title"
          value={newPub.title}
          onChange={(e)=>setNewPub({...newPub,title:e.target.value})}
        />

        <select
          value={newPub.publication_type}
          onChange={(e)=>setNewPub({...newPub,publication_type:e.target.value})}
        >
          <option value="">Publication Type</option>
          <option>Journal</option>
          <option>Conference</option>
        </select>

        <input
          type="text"
          placeholder="Journal / Conference Name"
          value={newPub.journal_name}
          onChange={(e)=>setNewPub({...newPub,journal_name:e.target.value})}
        />

        <input
          type="text"
          placeholder="Publisher"
          value={newPub.publisher}
          onChange={(e)=>setNewPub({...newPub,publisher:e.target.value})}
        />

        <input
          type="date"
          value={newPub.publication_date}
          onChange={(e)=>setNewPub({...newPub,publication_date:e.target.value})}
        />

        <input
          type="text"
          placeholder="DOI Link"
          value={newPub.doi_link}
          onChange={(e)=>setNewPub({...newPub,doi_link:e.target.value})}
        />

        <input
          type="text"
          placeholder="Paper Link"
          value={newPub.paper_link}
          onChange={(e)=>setNewPub({...newPub,paper_link:e.target.value})}
        />

        <input
          type="text"
          placeholder="Certificate Link"
          value={newPub.certificate_link}
          onChange={(e)=>setNewPub({...newPub,certificate_link:e.target.value})}
        />

        <button onClick={handleAdd}>+ Submit Publication</button>

      </div>

      {/* LIST (LIKE ACTIVITIES) */}
      {publications.length === 0 && (
        <p style={{textAlign:"center"}}>No publications added yet</p>
      )}

      {publications.map((pub) => (

  <div className="activity-card" key={pub.id}>

    {/* 🔹 Action buttons */}
    <div className="card-actions">
      <button
        className="edit"
        onClick={() => {
          setEditingId(pub.id);
          setEditPub(pub);
        }}
      >
        Edit
      </button>

      <button
        className="delete"
        onClick={() => handleDelete(pub.id)}
      >
        Delete
      </button>
    </div>

    {editingId === pub.id ? (

      <div className="edit-form">

        <input
          value={editPub.title}
          onChange={(e)=>setEditPub({...editPub,title:e.target.value})}
        />

        <select
          value={editPub.publication_type}
          onChange={(e)=>setEditPub({...editPub,publication_type:e.target.value})}
        >
          <option>Journal</option>
          <option>Conference</option>
        </select>

        <input
          value={editPub.journal_name}
          onChange={(e)=>setEditPub({...editPub,journal_name:e.target.value})}
        />

        <input
          value={editPub.publisher}
          onChange={(e)=>setEditPub({...editPub,publisher:e.target.value})}
        />

        <input
          type="date"
          value={editPub.publication_date?.split("T")[0]}
          onChange={(e)=>setEditPub({...editPub,publication_date:e.target.value})}
        />

        <input
          value={editPub.doi_link}
          onChange={(e)=>setEditPub({...editPub,doi_link:e.target.value})}
        />

        <input
          value={editPub.paper_link}
          onChange={(e)=>setEditPub({...editPub,paper_link:e.target.value})}
        />

        <input
          value={editPub.certificate_link}
          onChange={(e)=>setEditPub({...editPub,certificate_link:e.target.value})}
        />

        <button onClick={() => handleEditSave(pub.id)}>
          Save
        </button>

      </div>

    ) : (

      <div>

        <h4>{pub.title}</h4>

        <p>
          {pub.publication_type} • {pub.journal_name}
        </p>

        {pub.publisher && <p>{pub.publisher}</p>}

        <p className="time">
          {pub.publication_date &&
            new Date(pub.publication_date).toLocaleDateString()}
        </p>

        <div className="project-links">

          {pub.doi_link && (
            <a href={pub.doi_link} target="_blank">DOI</a>
          )}

          {pub.paper_link && (
            <a href={pub.paper_link} target="_blank">Paper</a>
          )}

          {pub.certificate_link && (
            <a href={pub.certificate_link} target="_blank">Certificate</a>
          )}

        </div>

      </div>

    )}

    <span className={`status ${(pub.status || "pending").toLowerCase()}`}>
      {pub.status || "Pending"}
    </span>

  </div>
))}
    </div>

  );

}
