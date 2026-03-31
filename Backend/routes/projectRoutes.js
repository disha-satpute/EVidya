const express = require("express");
const router = express.Router();

const {
addProject,
getStudentProjects
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


router.post(
"/add",
authMiddleware,
upload.single("screenshot"),
addProject
);

router.get(
"/student",
authMiddleware,
getStudentProjects
);

module.exports = router;