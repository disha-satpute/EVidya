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


router.get(
  "/all",
  authMiddleware,
  certificateController.getAllCertificates
);


router.put(
  "/approve/:id",
  authMiddleware,
  certificateController.approveCertificate
);


router.put(
  "/reject/:id",
  authMiddleware,
  certificateController.rejectCertificate
);


module.exports = router;