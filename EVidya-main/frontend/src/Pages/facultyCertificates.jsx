import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FacultyCertificates() {

  const [certificates, setCertificates] = useState([]);
   const [filter, setFilter] = useState("all");

  const fetchCertificates = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/certificates/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setCertificates(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load certificates");
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const pendingCount = certificates.filter(c => c.status === "Pending").length;
const approvedCount = certificates.filter(c => c.status === "Approved").length;
const rejectedCount = certificates.filter(c => c.status === "Rejected").length;
  const approve = async (id) => {
    try {

      await axios.put(
        `http://localhost:5000/api/certificates/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Certificate Approved");
      fetchCertificates();

    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {

      await axios.put(
        `http://localhost:5000/api/certificates/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.warning("Certificate Rejected");
      fetchCertificates();

    } catch {
      toast.error("Reject failed");
    }
  };

   const filteredCertificates = certificates.filter((cert) => {
  if (filter === "all") return true;
  return (cert.status || "Pending").toLowerCase() === filter;
});
  return (

    <div className="faculty-reviews-card">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>📜 Certificate Reviews</h2>
<div className="faculty-filters">

  <button
    className={`faculty-filter ${filter === "pending" ? "active" : ""}`}
    onClick={() => setFilter("pending")}
  >
    Pending Certificates ({pendingCount})
  </button>

  <button
    className={`faculty-filter ${filter === "approved" ? "active" : ""}`}
    onClick={() => setFilter("approved")}
  >
    Approved Certificates ({approvedCount})
  </button>

  <button
    className={`faculty-filter ${filter === "rejected" ? "active" : ""}`}
    onClick={() => setFilter("rejected")}
  >
    Rejected Certificates ({rejectedCount})
  </button>

  <button
    className={`faculty-filter ${filter === "all" ? "active" : ""}`}
    onClick={() => setFilter("all")}
  >
    All ({certificates.length})
  </button>

</div>
      <table className="faculty-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Certificate</th>
            <th>Issuer</th>
            <th>Date</th>
            <th>Proof</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {certificates.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No certificates submitted
              </td>
            </tr>
          ) : (

            filteredCertificates.map((cert) => (

              <tr key={cert.id}>

                <td>{cert.full_name}</td>

                <td>{cert.certificate_name}</td>

                <td>{cert.organization}</td>

                <td>
                  {new Date(cert.issue_date).toLocaleDateString()}
                </td>

                <td>
                  {cert.file_path ? (
                    <a
                      href={`http://localhost:5000/${cert.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>

                <td className="status-cell">
  <span
    className={`status-badge status-${(cert.status || "Pending").toLowerCase()}`}
  >
    {cert.status || "Pending"}
  </span>
</td>

                <td>

                  {cert.status === "Pending" && (
                    <>
                      <button
                        className="faculty-btn faculty-small faculty-green"
                        onClick={() => approve(cert.id)}
                      >
                        ✔
                      </button>

                      <button
                        className="faculty-btn faculty-small faculty-red"
                        onClick={() => reject(cert.id)}
                      >
                        ✖
                      </button>
                    </>
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