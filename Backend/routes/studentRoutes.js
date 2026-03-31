const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware"); 

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getStudentProfile);

module.exports = router;
