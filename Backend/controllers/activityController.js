const db = require("../config/db");

const addActivity = async (req, res) => {

  try {

    const { activity_title, activity_type, organization, activity_date, description } = req.body;

    const studentId = req.user.id;

    const filePath = req.file ? req.file.path : null;

    const result = await db.query(

      `INSERT INTO activities
      (student_id, activity_title, activity_type, organization, activity_date, description, proof_file)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,

      [studentId, activity_title, activity_type, organization, activity_date, description, filePath]

    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

};


const getStudentActivities = async (req, res) => {

  try {

    const studentId = req.user.id;

    const result = await db.query(

      "SELECT * FROM activities WHERE student_id=$1 ORDER BY created_at DESC",
      [studentId]

    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

};


const getAllActivities = async (req, res) => {

  try {

    const result = await db.query(

      `SELECT activities.*, students.full_name
       FROM activities
       JOIN students ON students.id = activities.student_id
       ORDER BY created_at DESC`

    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

};


const approveActivity = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(

      "UPDATE activities SET status='Approved' WHERE id=$1",
      [id]

    );

    res.json({ message: "Activity approved" });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};


const rejectActivity = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(

      "UPDATE activities SET status='Rejected' WHERE id=$1",
      [id]

    );

    res.json({ message: "Activity rejected" });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};

module.exports = {
  addActivity,
  getStudentActivities,
  getAllActivities,
  approveActivity,
  rejectActivity
};