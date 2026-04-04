const db = require("../config/db");

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
      [
        studentId,
        certificate_name,
        organization,
        issue_date,
        description,
        level,
        filePath
      ]
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

    // get certificate details
    const cert = await db.query(
      "SELECT * FROM certificates WHERE id=$1",
      [id]
    );

    const certificate = cert.rows[0];

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // prevent duplicate points
    if (certificate.status === "Approved") {
      return res.json({ message: "Already approved" });
    }

    // points based on level
    let points = 0;

    switch (certificate.level) {

      case "Beginner":
        points = 30;
        break;

      case "Intermediate":
        points = 60;
        break;

      case "Advanced":
        points = 100;
        break;

      case "Professional":
        points = 150;
        break;

      default:
        points = 20;

    }

    // update certificate
    await db.query(
      "UPDATE certificates SET status='Approved', points=$1 WHERE id=$2",
      [points, id]
    );

    // update student total points
    await db.query(
      "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
      [points, certificate.student_id]
    );

    res.json({ message: "Certificate approved", points });

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

const updateCertificate = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      certificate_name,
      organization,
      issue_date,
      level,
      description
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    // 🔥 1. Get existing certificate
    const certData = await db.query(
      "SELECT * FROM certificates WHERE id=$1",
      [id]
    );

    const cert = certData.rows[0];

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // 🔥 2. If already approved → remove points
    if (cert.status === "Approved" && cert.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [cert.points, cert.student_id]
      );
    }

    // 🔥 3. Update certificate and reset status
    const result = await db.query(
      `UPDATE certificates
       SET
         certificate_name = $1,
         organization = $2,
         issue_date = $3,
         level = $4,
         description = $5,
         file_path = COALESCE($6, file_path),
         status = 'Pending',
         points = 0   -- 🔥 reset points
       WHERE id = $7
       RETURNING *`,
      [
        certificate_name,
        organization,
        issue_date,
        level,
        description,
        filePath,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteCertificate = async (req, res) => {
  try {

    const { id } = req.params;
    const studentId = req.user.id;

    // 🔥 1. Get certificate
    const certData = await db.query(
      "SELECT * FROM certificates WHERE id=$1 AND student_id=$2",
      [id, studentId]
    );

    const cert = certData.rows[0];

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // 🔥 2. If approved → subtract points
    if (cert.status === "Approved" && cert.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [cert.points, cert.student_id]
      );
    }

    // 🔥 3. Delete certificate
    await db.query(
      "DELETE FROM certificates WHERE id=$1",
      [id]
    );

    res.json({ message: "Certificate deleted successfully" });

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
  rejectCertificate,
  updateCertificate,
  deleteCertificate
};