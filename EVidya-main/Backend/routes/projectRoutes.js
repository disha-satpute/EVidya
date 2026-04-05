const express = require("express");
const router = express.Router();

const {
  addProject,
  getStudentProjects,
  getAllProjects,
  updateProjectStatus,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ADD PROJECT
router.post(
  "/add",
  authMiddleware,
  upload.single("screenshot"),
  addProject
);

// GET STUDENT PROJECTS
router.get(
  "/student",
  authMiddleware,
  getStudentProjects
);

// GET ALL PROJECTS
router.get(
  "/all",
  authMiddleware,
  getAllProjects
);

// UPDATE STATUS
router.put(
  "/status/:id",
  authMiddleware,
  updateProjectStatus
);

// UPDATE PROJECT
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("screenshot"),
  updateProject
);

// DELETE PROJECT
router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

module.exports = router;
