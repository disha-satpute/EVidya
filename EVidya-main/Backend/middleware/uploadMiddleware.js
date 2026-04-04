const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    // certificates upload
    if (req.originalUrl.includes("certificates")) {
      cb(null, "uploads/certificates");
    }

    // activities upload
    else if (req.originalUrl.includes("activities")) {
      cb(null, "uploads/activities");
    }

    // ✅ NEW: ID CARD upload
    else if (req.originalUrl.includes("students")) {
      cb(null, "uploads/id_cards");
    }

    // fallback
    else {
      cb(null, "uploads");
    }

  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }

});

const upload = multer({ storage });

module.exports = upload;
