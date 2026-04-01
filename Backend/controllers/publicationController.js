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