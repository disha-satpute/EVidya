import { motion } from "framer-motion";
import "../styles/Student.css";
import studentGif from "../assets/student-illustration.gif";

export default function Student() {
  return (
    <div className="student-page">
      {/* Background glows */}
      <div className="bg-glow purple"></div>
      <div className="bg-glow blue"></div>

      <motion.div
        className="student-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT SIDE – FORM */}
        <div className="student-form">
          <h1>Complete Your Profile</h1>
          <p className="subtitle">
          </p>

          <form>

            <label>Full Name</label>
            <input type="text" placeholder=" Your Full name" />

            <label>Email</label>
            <input type="text" placeholder="Your College Name" />

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

        {/* RIGHT SIDE – IMAGE */}
        <div className="student-image">
          <img src={studentGif} alt="Student Illustration" />
        </div>
      </motion.div>
    </div>
  );
}