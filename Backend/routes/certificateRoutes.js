const express = require("express");
const router = express.Router();

const certificateController = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/add",
  authMiddleware,
  upload.single("certificate"),
  certificateController.addCertificate
);

router.get(
  "/student",
  authMiddleware,
  certificateController.getStudentCertificates
);

module.exports = router;