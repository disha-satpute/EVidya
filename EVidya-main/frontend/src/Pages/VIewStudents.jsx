import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewStudents() {

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [sorted, setSorted] = useState(false); // ⭐ track sort

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/faculty/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setStudents(res.data);
      setFiltered(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...students];

    // 🔍 search
    if (search) {
      data = data.filter((s) =>
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ⭐ SORT if button clicked
    if (sorted) {
      data.sort((a, b) => b.total_points - a.total_points);
    }

    setFiltered(data);

  }, [search, sorted, students]);

  /* ================= SORT BUTTON ================= */
  const handleSort = () => {
    setSorted(true);
  };

  const resetSort = () => {
    setSorted(false);
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: "30px" }}>

      <h2>My Students</h2>

      {/* 🔍 SEARCH + SORT */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        {/* SORT BUTTON */}
        <button onClick={handleSort}>
          Sort by Points 🔽
        </button>

        {/* RESET */}
        <button onClick={resetSort}>
          Reset
        </button>

      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p>No students found</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.full_name}</td>
                <td>{s.email}</td>
                <td>{s.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
