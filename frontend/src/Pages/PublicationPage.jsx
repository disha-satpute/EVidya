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

          <div>

            <h4>{pub.title}</h4>

            <p>
              {pub.publication_type} • {pub.journal_name}
            </p>

            {pub.publisher && (
              <p>{pub.publisher}</p>
            )}

            <p className="time">
              {pub.publication_date &&
                new Date(pub.publication_date).toLocaleDateString()
              }
            </p>

            {/* LINKS */}
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

          {/* STATUS */}
          <span className={`status ${(pub.status || "pending").toLowerCase()}`}>
            {pub.status || "Pending"}
          </span>

        </div>

      ))}

    </div>

  );

}
