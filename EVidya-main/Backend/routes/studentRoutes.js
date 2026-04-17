const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware"); 
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getStudentProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("id_card"),  
  updateStudentProfile
);
module.exports = router;


