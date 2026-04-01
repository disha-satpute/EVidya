const db = require("../config/db");

/* ================= ADD PROJECT ================= */
exports.addProject = async (req, res) => {
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
        "Pending"   // default status
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET STUDENT PROJECTS ================= */
exports.getStudentProjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await db.query(
      "SELECT * FROM projects WHERE student_id=$1 ORDER BY created_at DESC",
      [studentId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Get Student Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET ALL PROJECTS (FACULTY) ================= */
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT projects.*, students.full_name
      FROM projects
      JOIN students ON students.id = projects.student_id
      ORDER BY projects.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("Get All Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= UPDATE PROJECT STATUS ================= */
exports.updateProjectStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 1. Get project data
    const projectData = await db.query(
      "SELECT * FROM projects WHERE id=$1",
      [id]
    );

    const project = projectData.rows[0];

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Prevent duplicate approval
    if (project.status === "Approved") {
      return res.json({ message: "Already approved" });
    }

    let points = 0;

    // 3. Assign points based on project level
    switch (project.project_level) {

      case "Academic":
        points = 80;
        break;

      case "Personal":
        points = 60;
        break;

      case "Internship":
        points = 120;
        break;

      case "Open Source":
        points = 150;
        break;

      default:
        points = 50;
    }

    // 4. Update project status + points
    await db.query(
      "UPDATE projects SET status=$1, points=$2 WHERE id=$3",
      [status, status === "Approved" ? points : 0, id]
    );

    // 5. Add points to student ONLY if approved
    if (status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
        [points, project.student_id]
      );
    }

    res.json({
      message: `Project ${status}`,
      points: status === "Approved" ? points : 0
    });

  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
