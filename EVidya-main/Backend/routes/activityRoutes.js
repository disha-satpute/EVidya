const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadActivity = require("../middleware/uploadMiddleware");
const upload = require("../middleware/uploadMiddleware");


router.post(
  "/add",
  authMiddleware,
  uploadActivity.single("proof_file"),
  activityController.addActivity
);


router.get(
  "/student",
  authMiddleware,
  activityController.getStudentActivities
);


router.get(
  "/all",
  authMiddleware,
  activityController.getAllActivities
);


router.put(
  "/approve/:id",
  authMiddleware,
  activityController.approveActivity
);


router.put(
  "/reject/:id",
  authMiddleware,
  activityController.rejectActivity
);
/* UPDATE */
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("file"),
  activityController.updateActivity
);

/* DELETE */
router.delete(
  "/:id",
  authMiddleware,
  activityController.deleteActivity
);
module.exports = router;