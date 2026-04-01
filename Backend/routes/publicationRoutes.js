const express = require("express");
const router = express.Router();

const {
  addPublication,
  getStudentPublications,
  updatePublicationStatus,
  getAllPublications
} = require("../controllers/publicationController");

const authMiddleware = require("../middleware/authMiddleware");

/* ADD */
router.post("/add", authMiddleware, addPublication);

/* STUDENT PUBLICATIONS */
router.get("/student", authMiddleware, getStudentPublications);

/* ALL PUBLICATIONS */
router.get("/all", authMiddleware, getAllPublications);

/* UPDATE STATUS */
router.put("/status/:id", authMiddleware, updatePublicationStatus);

module.exports = router;
