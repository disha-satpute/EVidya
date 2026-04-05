const db = require("../config/db");

/* ================= ADD CERTIFICATE ================= */
const addCertificate = async (req, res) => {
  try {
    const {
      certificate_name,
      organization,
      issue_date,
      description,
      level
    } = req.body;

    const studentId = req.user.id;
    const filePath = req.file ? req.file.path : null;

    const result = await db.query(
      `INSERT INTO certificates
      (student_id, certificate_name, organization, issue_date, description, level, file_path)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [studentId, certificate_name, organization, issue_date, description, level, filePath]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET STUDENT CERTIFICATES ================= */
const getStudentCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await db.query(
      "SELECT * FROM certificates WHERE student_id=$1 ORDER BY created_at DESC",
      [studentId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET ALL CERTIFICATES (FACULTY FILTERED) ================= */
const getAllCertificates = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const studentsRes = await db.query(
      `SELECT id FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [faculty.branch, faculty.year, faculty.division]
    );

    const studentIds = studentsRes.rows.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json([]);
    }

    const certs = await db.query(
      `SELECT certificates.*, students.full_name
       FROM certificates
       JOIN students ON students.id = certificates.student_id
       WHERE certificates.student_id = ANY($1)
       ORDER BY certificates.created_at DESC`,
      [studentIds]
    );

    res.json(certs.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= APPROVE CERTIFICATE ================= */
const approveCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE certificates SET status='Approved' WHERE id=$1",
      [id]
    );

    res.json({ message: "Approved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= REJECT CERTIFICATE ================= */
const rejectCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE certificates SET status='Rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Rejected" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      certificate_name,
      organization,
      issue_date,
      description,
      level
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    const result = await db.query(
      `UPDATE certificates
       SET
         certificate_name=$1,
         organization=$2,
         issue_date=$3,
         description=$4,
         level=$5,
         file_path = COALESCE($6, file_path),
         status='Pending'
       WHERE id=$7
       RETURNING *`,
      [
        certificate_name,
        organization,
        issue_date,
        description,
        level,
        filePath,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM certificates WHERE id=$1",
      [id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= EXPORT ================= */
module.exports = {
  addCertificate,
  getStudentCertificates,
  getAllCertificates,
  approveCertificate,
  rejectCertificate,
  updateCertificate,
  deleteCertificate
};
