const db = require("../config/db");

/* ================= ADD PROJECT ================= */
const addProject = async (req, res) => {
  try {
    const studentId = req.user.id;

    const {
      project_title,
      description,
      technologies,
      category,
      project_level,
      start_date,
      end_date,
      github_link,
      demo_link,
      video_link
    } = req.body;

    const screenshot = req.file ? req.file.path : null;

    const result = await db.query(
      `INSERT INTO projects
      (student_id, project_title, description, technologies, category,
      project_level, start_date, end_date, github_link, demo_link, video_link, screenshot, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        studentId,
        project_title,
        description,
        technologies,
        category,
        project_level,
        start_date,
        end_date,
        github_link,
        demo_link,
        video_link,
        screenshot,
        "Pending"
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENT PROJECTS ================= */
const getStudentProjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await db.query(
      "SELECT * FROM projects WHERE student_id=$1 ORDER BY created_at DESC",
      [studentId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PROJECTS (FACULTY FILTERED) ================= */
const getAllProjects = async (req, res) => {
  try {

    const facultyId = req.user.id;

    // Get faculty details
    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    //  Get students under that faculty
    const studentsRes = await db.query(
      `SELECT id FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [faculty.branch, faculty.year, faculty.division]
    );

    const studentIds = studentsRes.rows.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json([]);
    }

    //  Get only THEIR projects
    const result = await db.query(
      `SELECT projects.*, students.full_name
       FROM projects
       JOIN students ON students.id = projects.student_id
       WHERE projects.student_id = ANY($1)
       ORDER BY projects.created_at DESC`,
      [studentIds]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Get Faculty Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STATUS ================= */
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const projectData = await db.query(
      "SELECT * FROM projects WHERE id=$1",
      [id]
    );

    const project = projectData.rows[0];

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status === "Approved") {
      return res.json({ message: "Already approved" });
    }

    let points = 0;

    switch (project.project_level) {
      case "Academic": points = 80; break;
      case "Personal": points = 60; break;
      case "Internship": points = 120; break;
      case "Open Source": points = 150; break;
      default: points = 50;
    }

    await db.query(
      "UPDATE projects SET status=$1, points=$2 WHERE id=$3",
      [status, status === "Approved" ? points : 0, id]
    );

    if (status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
        [points, project.student_id]
      );
    }

    res.json({ message: `Project ${status}`, points });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PROJECT ================= */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query(
      "SELECT * FROM projects WHERE id=$1",
      [id]
    );

    const project = existing.rows[0];

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const {
      project_title,
      description,
      technologies,
      category,
      project_level,
      start_date,
      end_date,
      github_link,
      demo_link,
      video_link
    } = req.body;

    const screenshot = req.file ? req.file.path : null;

    if (project.status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [project.points || 0, project.student_id]
      );
    }

    const result = await db.query(
      `UPDATE projects SET
        project_title=$1,
        description=$2,
        technologies=$3,
        category=$4,
        project_level=$5,
        start_date=$6,
        end_date=$7,
        github_link=$8,
        demo_link=$9,
        video_link=$10,
        screenshot = COALESCE($11, screenshot),
        status='Pending',
        points = 0
      WHERE id=$12
      RETURNING *`,
      [
        project_title,
        description,
        technologies,
        category,
        project_level,
        start_date,
        end_date,
        github_link,
        demo_link,
        video_link,
        screenshot,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ================= */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const projectData = await db.query(
      "SELECT * FROM projects WHERE id=$1",
      [id]
    );

    const project = projectData.rows[0];

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [project.points || 0, project.student_id]
      );
    }

    await db.query("DELETE FROM projects WHERE id=$1", [id]);

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* EXPORT */
module.exports = {
  addProject,
  getStudentProjects,
  getAllProjects,
  updateProjectStatus,
  updateProject,
  deleteProject
};
