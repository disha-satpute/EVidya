const db = require("../config/db");


/* ================= ADD ACTIVITY ================= */

const addActivity = async (req, res) => {

  try {

    const {
      activity_title,
      activity_type,
      organization,
      activity_date,
      description
    } = req.body;

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


/* ================= GET STUDENT ACTIVITIES ================= */

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


/* ================= GET ALL ACTIVITY ================= */

const getAllActivities = async (req, res) => {
  try {

    const facultyId = req.user.id;

    // 🔥 Get faculty profile
    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const { branch, year, division } = faculty;

    // 🔥 Get assigned students
    const studentsRes = await db.query(
      `SELECT id FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [branch, year, division]
    );

    const studentIds = studentsRes.rows.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json([]);
    }

    // 🔥 Get only THEIR activities
    const result = await db.query(
      `SELECT activities.*, students.full_name
       FROM activities
       JOIN students ON students.id = activities.student_id
       WHERE activities.student_id = ANY($1)
       ORDER BY activities.created_at DESC`,
      [studentIds]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= APPROVE ACTIVITY ================= */

const approveActivity = async (req, res) => {
  try {

    const { id } = req.params;
    const facultyId = req.user.id;

    // 🔥 Get faculty
    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    // 🔥 Get activity + student info
    const activityRes = await db.query(
      `SELECT activities.*, students.branch, students.year, students.division, students.id as student_id
       FROM activities
       JOIN students ON students.id = activities.student_id
       WHERE activities.id=$1`,
      [id]
    );

    const activity = activityRes.rows[0];

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // 🔒 ACCESS CHECK
    if (
      activity.branch !== faculty.branch ||
      activity.year !== faculty.year ||
      activity.division !== faculty.division
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (activity.status === "Approved") {
      return res.json({ message: "Already approved" });
    }

    // 🔥 POINT LOGIC
    let points = 0;

    switch (activity.activity_type) {
      case "Hackathon":
        points = 100;
        break;
      case "Competition":
        points = 80;
        break;
      case "Internship":
        points = 120;
        break;
      case "Workshop":
        points = 40;
        break;
      case "Seminar":
        points = 30;
        break;
      case "Volunteering":
        points = 25;
        break;
      default:
        points = 20;
    }

    await db.query(
      "UPDATE activities SET status='Approved', points=$1 WHERE id=$2",
      [points, id]
    );

    await db.query(
      "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
      [points, activity.student_id]
    );

    res.json({ message: "Activity approved", points });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= REJECT ACTIVITY ================= */

const rejectActivity = async (req, res) => {
  try {

    const { id } = req.params;
    const facultyId = req.user.id;

    // 🔥 Get faculty
    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    // 🔥 Get activity + student
    const activityRes = await db.query(
      `SELECT activities.*, students.branch, students.year, students.division
       FROM activities
       JOIN students ON students.id = activities.student_id
       WHERE activities.id=$1`,
      [id]
    );

    const activity = activityRes.rows[0];

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // 🔒 ACCESS CHECK
    if (
      activity.branch !== faculty.branch ||
      activity.year !== faculty.year ||
      activity.division !== faculty.division
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.query(
      "UPDATE activities SET status='Rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Activity rejected" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= UPDATE ACTIVITY ================= */

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      activity_title,
      activity_type,
      organization,
      activity_date,
      description
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    // Step 1: Get old activity
    const old = await db.query(
      "SELECT * FROM activities WHERE id=$1",
      [id]
    );

    const activity = old.rows[0];

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Step 2: If already approved → subtract points
    if (activity.status === "Approved" && activity.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [activity.points, activity.student_id]
      );
    }

    // Step 3: Update activity & reset status
    const result = await db.query(
      `UPDATE activities
       SET
         activity_title=$1,
         activity_type=$2,
         organization=$3,
         activity_date=$4,
         description=$5,
         proof_file = COALESCE($6, proof_file),
         status='Pending',
         points = 0
       WHERE id=$7
       RETURNING *`,
      [
        activity_title,
        activity_type,
        organization,
        activity_date,
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


/* ================= DELETE ACTIVITY ================= */
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    // 🔐 Check ownership
    const check = await db.query(
      "SELECT * FROM activities WHERE id=$1 AND student_id=$2",
      [id, studentId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const activity = check.rows[0];

    // 🔥 Step 1: If approved → subtract points
    if (activity.status === "Approved" && activity.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [activity.points, activity.student_id]
      );
    }

    // 🔥 Step 2: Delete activity
    await db.query(
      "DELETE FROM activities WHERE id=$1",
      [id]
    );

    res.json({ message: "Activity deleted & points updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addActivity,
  getStudentActivities,
  getAllActivities,
  approveActivity,
  rejectActivity,
  updateActivity,
  deleteActivity
};