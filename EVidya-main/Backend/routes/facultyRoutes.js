const express = require("express");
const router = express.Router();

const {
  registerFaculty,
  loginFaculty,
  getDashboardStats,
  getProfile,
  updateProfile,
  getMyStudents
} = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerFaculty);
router.post("/login", loginFaculty);
router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/students", authMiddleware, getMyStudents);

module.exports = router;
