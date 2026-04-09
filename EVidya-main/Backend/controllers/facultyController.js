const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.registerFaculty = async (req, res) => {
  try {
    const { fullName, college, email, password, confirmPassword } = req.body;

    if (!fullName || !college || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await pool.query(
      "SELECT * FROM faculty WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0)
      return res.status(400).json({ message: "User already Registered, Please Login" });


    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO faculty (full_name,college,email,password_hash)
       VALUES ($1,$2,$3,$4)
       RETURNING id,full_name,email`,
      [fullName, college, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role: "FACULTY" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Faculty registered successfully",
      token,
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM faculty WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: "FACULTY" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        full_name: user.rows[0].full_name,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {

    const facultyId = req.user.id;

    // 🔥 Get faculty details
    const facultyData = await pool.query(
      "SELECT * FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyData.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const { branch, year, division } = faculty;

    // 🔥 Filter students under this faculty
    const studentIdsRes = await pool.query(
      `SELECT id FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [branch, year, division]
    );

    const studentIds = studentIdsRes.rows.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json({
        pendingCertificates: 0,
        pendingActivities: 0,
        pendingProjects: 0,
        pendingPublications: 0,
        totalStudents: 0
      });
    }

    /* ================= FILTERED COUNTS ================= */

    const pendingCertificates = await pool.query(
      `SELECT COUNT(*) FROM certificates
       WHERE status='Pending' AND student_id = ANY($1)`,
      [studentIds]
    );

    const pendingActivities = await pool.query(
      `SELECT COUNT(*) FROM activities
       WHERE status='Pending' AND student_id = ANY($1)`,
      [studentIds]
    );

    const pendingProjects = await pool.query(
      `SELECT COUNT(*) FROM projects
       WHERE status='Pending' AND student_id = ANY($1)`,
      [studentIds]
    );

    const pendingPublications = await pool.query(
      `SELECT COUNT(*) FROM publications
       WHERE status='Pending' AND student_id = ANY($1)`,
      [studentIds]
    );

    res.json({
      pendingCertificates: pendingCertificates.rows[0].count,
      pendingActivities: pendingActivities.rows[0].count,
      pendingProjects: pendingProjects.rows[0].count,
      pendingPublications: pendingPublications.rows[0].count,
      totalStudents: studentIds.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM faculty WHERE id=$1",
      [facultyId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const {
      full_name,
      institute_name,
      designation,
      qualification,
      expertise,
      branch,
      year,
      division
    } = req.body;

    await pool.query(
      `UPDATE faculty SET
        full_name=$1,
        college=$2,
        designation=$3,
        qualification=$4,
        expertise=$5,
        branch=$6,
        year=$7,
        division=$8
      WHERE id=$9`,
      [
        full_name,
        institute_name,   // maps to college
        designation,
        qualification,
        expertise,
        branch,
        year,
        division,
        facultyId
      ]
    );

    res.json({ message: "Profile updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyStudents = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // 🔥 Get faculty details
    const facultyData = await pool.query(
      "SELECT * FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyData.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const { branch, year, division } = faculty;

    // 🔥 Get only matching students
    const students = await pool.query(
      `SELECT id, full_name, email, branch, year, division, total_points
       FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [branch, year, division]
    );

    res.json(students.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
