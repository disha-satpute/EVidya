const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
addProject,
getStudentProjects,
deleteProject
} = require("../controllers/projectController");

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

router.delete(
"/:id",
authMiddleware,
deleteProject
);

module.exports = router;