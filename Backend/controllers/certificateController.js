const db = require("../config/db");

const addCertificate = async (req, res) => {
  try {

    const { certificate_name, organization, issue_date, description } = req.body;
    const studentId = req.user.id;
    const filePath = req.file ? req.file.path : null;

    const result = await db.query(
      `INSERT INTO certificates 
      (student_id, certificate_name, organization, issue_date, description, file_path)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [studentId, certificate_name, organization, issue_date, description, filePath]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


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


const getAllCertificates = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT certificates.*, students.full_name
      FROM certificates
      JOIN students ON certificates.student_id = students.id
      ORDER BY certificates.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const approveCertificate = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "UPDATE certificates SET status='Approved' WHERE id=$1",
      [id]
    );

    res.json({ message: "Certificate approved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const rejectCertificate = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "UPDATE certificates SET status='Rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Certificate rejected" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addCertificate,
  getStudentCertificates,
  getAllCertificates,
  approveCertificate,
  rejectCertificate
};