import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/student_certificate.css";


export default function CertificatesPage() {

  const fileInputRef = useRef(null);

  const [certificates, setCertificates] = useState([]);

  const [newCert, setNewCert] = useState({
    certificate_name: "",
    organization: "",
    issue_date: "",
    description: "",
    level: "",
    certificate: null
  });


  const [editingId, setEditingId] = useState(null);
const [editCert, setEditCert] = useState({});
  // Fetch certificates
  const fetchCertificates = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/certificates/student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setCertificates(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleAdd = async () => {

    if (!newCert.certificate_name ||
        !newCert.organization ||
        !newCert.issue_date) {

      toast.warning("Please fill all required fields!");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("certificate_name", newCert.certificate_name);
      formData.append("organization", newCert.organization);
      formData.append("issue_date", newCert.issue_date);
      formData.append("description", newCert.description);
      formData.append("level", newCert.level);

      if (newCert.certificate) {
        formData.append("certificate", newCert.certificate);
      }

      const res = await axios.post(
        "http://localhost:5000/api/certificates/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setCertificates([...certificates, res.data]);

      toast.success("Certificate submitted successfully! Waiting for approval.");

      setNewCert({
        certificate_name: "",
        organization: "",
        issue_date: "",
        description: "",
        level: "",
        certificate: null
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {

      toast.error("Something went wrong");

    }

  };
const handleDelete = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/certificates/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setCertificates(certificates.filter(c => c.id !== id));
    toast.success("Certificate deleted");
  } catch (err) {
    toast.error("Delete failed");
  }
};

const handleEditSave = async (id) => {
  try {
    await axios.put(
      `http://localhost:5000/api/certificates/${id}`,
      editCert,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setCertificates(certificates.map(c => c.id === id ? {...c, ...editCert} : c));
    setEditingId(null);
    toast.success("Certificate updated");
  } catch (err) {
    toast.error("Update failed");
  }
};
  return (
    
    <div className="activities-section">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Certificates</h2>

      <div className="cert-form">

        <input
          type="text"
          placeholder="Certificate Name"
          value={newCert.certificate_name}
          onChange={(e)=>setNewCert({...newCert,certificate_name:e.target.value})}
        />

        <input
          type="text"
          placeholder="Issuing Organization"
          value={newCert.organization}
          onChange={(e)=>setNewCert({...newCert,organization:e.target.value})}
        />

        <input
          type="date"
          value={newCert.issue_date}
          onChange={(e)=>setNewCert({...newCert,issue_date:e.target.value})}
        />

        <select
          value={newCert.level}
          onChange={(e)=>setNewCert({...newCert,level:e.target.value})}
        >
          <option value="">Certificate Level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Professional</option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={newCert.description}
          onChange={(e)=>setNewCert({...newCert,description:e.target.value})}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e)=>setNewCert({...newCert,certificate:e.target.files[0]})}
        />

        <button onClick={handleAdd}>+ Add</button>

      </div>

      {certificates.map((cert) => (

  <div className="activity-card" key={cert.id}>

    {/* 🔹 Action buttons */}
    <div className="card-actions">
      <button
        className="edit"
        onClick={()=>{
          setEditingId(cert.id);
          setEditCert(cert);
        }}
      >
        Edit
      </button>

      <button
        className="delete"
        onClick={()=>handleDelete(cert.id)}
      >
        Delete
      </button>
    </div>

    {editingId === cert.id ? (

      <div className="edit-form">

        <input
          value={editCert.certificate_name}
          onChange={(e)=>setEditCert({...editCert, certificate_name:e.target.value})}
        />

        <input
          value={editCert.organization}
          onChange={(e)=>setEditCert({...editCert, organization:e.target.value})}
        />

        <input
          type="date"
          value={editCert.issue_date?.split("T")[0]}
          onChange={(e)=>setEditCert({...editCert, issue_date:e.target.value})}
        />

        <select
          value={editCert.level}
          onChange={(e)=>setEditCert({...editCert, level:e.target.value})}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Professional</option>
        </select>

        <button onClick={()=>handleEditSave(cert.id)}>Save</button>

      </div>

    ) : (

      <div>

        <h4>{cert.certificate_name}</h4>
        <p>{cert.organization}</p>

        <p className="time">
          {new Date(cert.issue_date).toLocaleDateString()}
        </p>

        {cert.level && <p>Level: {cert.level}</p>}
        {cert.description && <p>{cert.description.slice(0,50)}</p>}

        {cert.file_path && (
          <a
            href={`http://localhost:5000/${cert.file_path}`}
            target="_blank"
            rel="noreferrer"
          >
            View Certificate
          </a>
        )}

      </div>

    )}

    <span className={`status ${(cert.status || "pending").toLowerCase()}`}>
      {cert.status || "Pending"}
    </span>

  </div>
))}

    </div>
  );
}