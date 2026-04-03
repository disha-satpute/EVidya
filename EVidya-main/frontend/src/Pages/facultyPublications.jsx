import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FacultyPublications() {

  const [publications, setPublications] = useState([]);
  const [filter, setFilter] = useState("all");

  /* ================= FETCH ================= */
  const fetchPublications = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/publications/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setPublications(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load publications");
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  /* ================= COUNTS ================= */
  const pendingCount = publications.filter(p => p.status === "Pending").length;
  const approvedCount = publications.filter(p => p.status === "Approved").length;
  const rejectedCount = publications.filter(p => p.status === "Rejected").length;

  /* ================= FILTER ================= */
  const filteredPublications = publications.filter((pub) => {
  if (filter === "all") return true;
  return (pub.status || "Pending").toLowerCase() === filter;
});

  /* ================= ACTION ================= */
  const handleStatusUpdate = async (id, status) => {
    try {

      await axios.put(
        `http://localhost:5000/api/publications/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success(`Publication ${status}`);
      fetchPublications();

    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  /* ================= UI ================= */
  return (

    <div className="faculty-reviews-card">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>📄 Publication Reviews</h2>

      {/* FILTERS */}
      <div className="faculty-filters">

        <button
          className={`faculty-filter ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingCount})
        </button>

        <button
          className={`faculty-filter ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved ({approvedCount})
        </button>

        <button
          className={`faculty-filter ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected ({rejectedCount})
        </button>

        <button
          className={`faculty-filter ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({publications.length})
        </button>

      </div>

      {/* TABLE */}
      <table className="faculty-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Title</th>
            <th>Type</th>
            <th>Journal</th>
            <th>Publisher</th>
            <th>Date</th>
            <th>Links</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredPublications.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No publications found
              </td>
            </tr>
          ) : (

            filteredPublications.map((pub) => (

              <tr key={pub.id}>

                <td>{pub.full_name}</td>

                <td>{pub.title}</td>

                <td>{pub.publication_type}</td>

                <td>{pub.journal_name}</td>

                <td>{pub.publisher}</td>

                <td>
                  {pub.publication_date &&
                    new Date(pub.publication_date).toLocaleDateString()}
                </td>

                <td>

                  {pub.doi_link && (
                    <a href={pub.doi_link} target="_blank">DOI</a>
                  )}

                  {" "}

                  {pub.paper_link && (
                    <a href={pub.paper_link} target="_blank">Paper</a>
                  )}

                  {" "}

                  {pub.certificate_link && (
                    <a href={pub.certificate_link} target="_blank">Certificate</a>
                  )}

                </td>

                {/* STATUS */}
                <td className="status-cell">
  <span
    className={`status-badge status-${(pub.status || "Pending").toLowerCase()}`}
  >
    {pub.status || "Pending"}
  </span>
</td>

                {/* ACTION */}
                <td>

                  {pub.status === "Pending" && (
                    <>
                      <button
                        className="faculty-btn faculty-small faculty-green"
                        onClick={() => handleStatusUpdate(pub.id, "Approved")}
                      >
                        ✔
                      </button>

                      <button
                        className="faculty-btn faculty-small faculty-red"
                        onClick={() => handleStatusUpdate(pub.id, "Rejected")}
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
