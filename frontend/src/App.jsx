import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import SignIn from "./Pages/SignIn";
import Register from "./Pages/Register";
import Faculty from "./Pages/Faculty";
import Student from "./Pages/Student";
import StudentDashboard from "./Pages/studentDashboard";
import FacultyDashboard from "./Pages/facultyDashboard";  // Uppercase F
import AdminDashboard from "./Pages/adminDashboard";      // Uppercase A
import VideoPage from "./Pages/video";
import FAQPage from "./Pages/FAQ";
import AboutPage from "./Pages/About";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />  {/* Changed path for consistency */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />      {/* Changed path for consistency */}
        <Route path="/video" element={<VideoPage />} />
        <Route path="/FAQ" element={<FAQPage />} />
        <Route path="/About" element={<AboutPage />} />
        
      </Routes>
      
    </Router>
    
  );
}

export default App;
