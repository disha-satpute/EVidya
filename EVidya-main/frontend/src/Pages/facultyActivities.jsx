import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FacultyActivities() {

  const [activities, setActivities] = useState([]);
const [filter, setFilter] = useState("all");
  
  const fetchActivities = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/activities/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setActivities(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load activities");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const pendingCount = activities.filter(a => a.status === "Pending").length;
const approvedCount = activities.filter(a => a.status === "Approved").length;
const rejectedCount = activities.filter(a => a.status === "Rejected").length;
  const approve = async (id) => {
    try {

      await axios.put(
        `http://localhost:5000/api/activities/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Activity Approved");
      fetchActivities();

    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {

      await axios.put(
        `http://localhost:5000/api/activities/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.warning("Activity Rejected");
      fetchActivities();

    } catch (err) {
      toast.error("Reject failed");
    }
  };
const filteredActivities = activities.filter((act) => {
  if (filter === "all") return true;
  return (act.status || "Pending").toLowerCase() === filter;
});
  return (

    <div className="faculty-reviews-card">

      <ToastContainer position="top-right" autoClose={3000} />

      <h2>🏆 Activity Reviews</h2>
<div className="faculty-filters">

  <button
    className={`faculty-filter ${filter === "pending" ? "active" : ""}`}
    onClick={() => setFilter("pending")}
  >
    Pending Activities ({pendingCount})
  </button>

  <button
    className={`faculty-filter ${filter === "approved" ? "active" : ""}`}
    onClick={() => setFilter("approved")}
  >
    Approved Activities ({approvedCount})
  </button>

  <button
    className={`faculty-filter ${filter === "rejected" ? "active" : ""}`}
    onClick={() => setFilter("rejected")}
  >
    Rejected Activities ({rejectedCount})
  </button>

  <button
    className={`faculty-filter ${filter === "all" ? "active" : ""}`}
    onClick={() => setFilter("all")}
  >
    All ({activities.length})
  </button>

</div>
      <table className="faculty-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Activity</th>
            <th>Type</th>
            <th>Date</th>
            <th>Proof</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {activities.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No activities submitted
              </td>
            </tr>
          ) : (

           filteredActivities.map((act) => (

              <tr key={act.id}>

                <td>{act.full_name}</td>

                <td>{act.activity_title}</td>

                <td>{act.activity_type}</td>

                <td>
                  {new Date(act.activity_date).toLocaleDateString()}
                </td>

                <td>
                  {act.proof_file ? (
                    <a
                      href={`http://localhost:5000/${act.proof_file}`}
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
    className={`status-badge status-${(act.status || "Pending").toLowerCase()}`}
  >
    {act.status || "Pending"}
  </span>
</td>

                <td>

                  {act.status === "Pending" && (
                    <>
                      <button
                        className="faculty-btn faculty-small faculty-green"
                        onClick={() => approve(act.id)}
                      >
                        ✔
                      </button>

                      <button
                        className="faculty-btn faculty-small faculty-red"
                        onClick={() => reject(act.id)}
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