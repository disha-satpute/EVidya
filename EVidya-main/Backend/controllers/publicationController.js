const db = require("../config/db");

/* ================= ADD PUBLICATION ================= */
exports.addPublication = async (req, res) => {
  try {

    const studentId = req.user.id;

    const {
      title,
      publication_type,
      journal_name,
      publisher,
      publication_date,
      doi_link,
      paper_link,
      certificate_link
    } = req.body;

    const result = await db.query(
      `INSERT INTO publications
      (student_id, title, publication_type, journal_name, publisher,
       publication_date, doi_link, paper_link, certificate_link, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        studentId,
        title,
        publication_type,
        journal_name,
        publisher,
        publication_date,
        doi_link,
        paper_link,
        certificate_link,
        "Pending"
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENT PUBLICATIONS ================= */
exports.getStudentPublications = async (req, res) => {
  try {

    const studentId = req.user.id;

    const result = await db.query(
      "SELECT * FROM publications WHERE student_id=$1 ORDER BY created_at DESC",
      [studentId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL (FACULTY FILTERED) ================= */
exports.getAllPublications = async (req, res) => {
  try {

    const facultyId = req.user.id;

    // 🔥 get faculty details
    const facultyRes = await db.query(
      "SELECT branch, year, division FROM faculty WHERE id=$1",
      [facultyId]
    );

    const faculty = facultyRes.rows[0];

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // 🔥 get assigned students
    const studentsRes = await db.query(
      `SELECT id FROM students
       WHERE branch=$1 AND year=$2 AND division=$3`,
      [faculty.branch, faculty.year, faculty.division]
    );

    const studentIds = studentsRes.rows.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json([]);
    }

    // 🔥 get publications of those students only
    const result = await db.query(
      `SELECT publications.*, students.full_name
       FROM publications
       JOIN students ON students.id = publications.student_id
       WHERE publications.student_id = ANY($1)
       ORDER BY publications.created_at DESC`,
      [studentIds]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE / REJECT ================= */
exports.updatePublicationStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const data = await db.query(
      "SELECT * FROM publications WHERE id=$1",
      [id]
    );

    const pub = data.rows[0];

    if (!pub) return res.status(404).json({ message: "Not found" });

    if (pub.status === "Approved") {
      return res.json({ message: "Already approved" });
    }

    let points = 0;

    switch (pub.publication_type) {
      case "Journal":
        points = 150;
        break;
      case "Conference":
        points = 100;
        break;
      default:
        points = 80;
    }

    await db.query(
      "UPDATE publications SET status=$1, points=$2 WHERE id=$3",
      [status, status === "Approved" ? points : 0, id]
    );

    if (status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
        [points, pub.student_id]
      );
    }

    res.json({
      message: `Publication ${status}`,
      points: status === "Approved" ? points : 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PUBLICATION ================= */
exports.updatePublication = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      publication_type,
      journal_name,
      publisher,
      publication_date,
      doi_link,
      paper_link,
      certificate_link
    } = req.body;

    const old = await db.query(
      "SELECT * FROM publications WHERE id=$1",
      [id]
    );

    const pub = old.rows[0];

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    // 🔥 remove old points if approved
    if (pub.status === "Approved" && pub.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [pub.points, pub.student_id]
      );
    }

    const result = await db.query(
      `UPDATE publications
       SET
         title=$1,
         publication_type=$2,
         journal_name=$3,
         publisher=$4,
         publication_date=$5,
         doi_link=$6,
         paper_link=$7,
         certificate_link=$8,
         status='Pending',
         points=0
       WHERE id=$9
       RETURNING *`,
      [
        title,
        publication_type,
        journal_name,
        publisher,
        publication_date,
        doi_link,
        paper_link,
        certificate_link,
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
exports.deletePublication = async (req, res) => {
  try {

    const { id } = req.params;
    const studentId = req.user.id;

    const check = await db.query(
      "SELECT * FROM publications WHERE id=$1 AND student_id=$2",
      [id, studentId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const pub = check.rows[0];

    if (pub.status === "Approved" && pub.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [pub.points, pub.student_id]
      );
    }

    await db.query(
      "DELETE FROM publications WHERE id=$1",
      [id]
    );

    res.json({ message: "Publication deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
