const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Evidya Backend Running 🚀"
  });
});

app.get("/api/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      success: true,
      message: "Database Connected ",
      serverTime: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database Connection Failed ",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
