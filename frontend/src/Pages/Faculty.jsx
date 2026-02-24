import React from "react";
import { motion } from "framer-motion";
import "../styles/Faculty.css";
import facultyGif from "../assets/faculty-illustration.gif";

const FacultyProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/students/register",
        formData
      );

      // Save token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", "Student");

      alert("Student Registered Successfully 🎉");

      navigate("/student-dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }

    setLoading(false);
  };
  return (
    <div className="faculty-page">
      {/* Background glow */}
      <div className="faculty-glow purple"></div>
      <div className="faculty-glow blue"></div>

      <motion.div
        className="faculty-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT – FORM */}
        <div className="faculty-form">
          <h1>Complete Faculty Profile</h1>
          <p className="subtitle">
            Build a professional academic identity 👩‍🏫
          </p>

          <form>
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name" />

            <label>College</label>
            <input type="text" placeholder="Enter institution name" />

            <label>Email</label>
            <input type="text" placeholder="Email" />

            <label>Password</label>
            <input placeholder="********" />

            <label>Confirm Password</label>
            <input placeholder="********" />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              Register
            </motion.button>
          </form>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="faculty-image">
          <img src={facultyGif} alt="Faculty Illustration" />
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyProfile;