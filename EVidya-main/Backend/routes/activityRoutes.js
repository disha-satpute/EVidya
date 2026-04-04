const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/* ADD */
router.post(
  "/add",
  authMiddleware,
  upload.single("proof_file"),   // ✅ consistent
  activityController.addActivity
);

/* STUDENT */
router.get(
  "/student",
  authMiddleware,
  activityController.getStudentActivities
);

/* ALL */
router.get(
  "/all",
  authMiddleware,
  activityController.getAllActivities
);

/* UPDATE */
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("proof_file"),   // ✅ FIXED
  activityController.updateActivity
);

/* DELETE */
router.delete(
  "/:id",   // ✅ keep simple
  authMiddleware,
  activityController.deleteActivity
);

/* APPROVE */
router.put(
  "/approve/:id",
  authMiddleware,
  activityController.approveActivity
);

/* REJECT */
router.put(
  "/reject/:id",
  authMiddleware,
  activityController.rejectActivity
);

module.exports = router;
