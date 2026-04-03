const express = require("express");
const router = express.Router();
const {
  registerFaculty,
  loginFaculty,
  getDashboardStats
} = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");


router.post("/register", registerFaculty);
router.post("/login", loginFaculty);
router.get("/dashboard", authMiddleware, getDashboardStats);


module.exports = router;
