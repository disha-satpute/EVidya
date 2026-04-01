const express = require("express");
const router = express.Router();

const {
addProject,
getStudentProjects,
getAllProjects,
updateProjectStatus
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

router.get(
"/all",
authMiddleware,
getAllProjects
);

router.put(
    "/status/:id", 
    authMiddleware, 
    updateProjectStatus
);
module.exports = router;
