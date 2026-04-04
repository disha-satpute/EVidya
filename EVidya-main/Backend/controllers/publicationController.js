const db = require("../config/db");

/* ADD PUBLICATION */
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
      [status, points, id]
    );

    if (status === "Approved") {
      await db.query(
        "UPDATE students SET total_points = total_points + $1 WHERE id=$2",
        [points, pub.student_id]
      );
    }

    res.json({ message: `Publication ${status}`, points });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};
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

exports.getAllPublications = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT publications.*, students.full_name
      FROM publications
      JOIN students ON students.id = publications.student_id
      ORDER BY publications.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("Get All Publications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
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

    // 🔥 1. Get old publication
    const old = await db.query(
      "SELECT * FROM publications WHERE id=$1",
      [id]
    );

    const pub = old.rows[0];

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    // 🔥 2. If approved → remove points
    if (pub.status === "Approved" && pub.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [pub.points, pub.student_id]
      );
    }

    // 🔥 3. Update publication
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

    // 🔥 1. Get old publication
    const old = await db.query(
      "SELECT * FROM publications WHERE id=$1",
      [id]
    );

    const pub = old.rows[0];

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    // 🔥 2. If approved → remove points
    if (pub.status === "Approved" && pub.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [pub.points, pub.student_id]
      );
    }

    // 🔥 3. Update publication
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
exports.deletePublication = async (req, res) => {
  try {

    const { id } = req.params;
    const studentId = req.user.id;

    // 🔐 check ownership
    const check = await db.query(
      "SELECT * FROM publications WHERE id=$1 AND student_id=$2",
      [id, studentId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const pub = check.rows[0];

    // 🔥 If approved → subtract points
    if (pub.status === "Approved" && pub.points > 0) {
      await db.query(
        "UPDATE students SET total_points = total_points - $1 WHERE id=$2",
        [pub.points, pub.student_id]
      );
    }

    // 🔥 delete
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
