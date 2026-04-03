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

    const pendingCertificates = await pool.query(
      "SELECT COUNT(*) FROM certificates WHERE status='Pending'"
    );

    const pendingActivities = await pool.query(
      "SELECT COUNT(*) FROM activities WHERE status='Pending'"
    );

      const pendingProjects = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE status='Pending'"
    );

    const pendingpublications = await pool.query(
      "SELECT COUNT(*) FROM publications WHERE status='Pending'"  
    );


    const approvedThisMonth = await pool.query(`
      SELECT COUNT(*)
      FROM certificates
      WHERE status='Approved'
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    const totalStudents = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    res.json({
      pendingCertificates: pendingCertificates.rows[0].count,
      pendingActivities: pendingActivities.rows[0].count,
      pendingProjects: pendingProjects.rows[0].count,
      pendingPublications: pendingpublications.rows[0].count,
      totalStudents: totalStudents.rows[0].count
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};