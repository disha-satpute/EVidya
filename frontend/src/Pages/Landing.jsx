// src/Pages/Landing.jsx
import { Link } from "react-router-dom";
import boyImg from "../assets/boy.png";
import girlImg from "../assets/girl.png";

import { motion, useMotionValue, useSpring } from "framer-motion";

import {
  ArrowRight,
  Trophy,
  Users,
  FileText,
  Award,
  BarChart3,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

import heroImage from "../assets/hero-image.png";
import LogoImage from "../assets/Logo.png";

/* =======================
   Smooth Interactive Card
======================= */
const SmoothStepCard = ({ number, title, desc, tag, colorClass }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    x.set(offsetX * 0.15);
    y.set(offsetY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`step-card ${colorClass}`}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 30px 60px rgba(0,0,0,0.2)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="step-tag">{tag}</span>
    </motion.div>
  );
};

const LandingPage = () => {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <div className="logo-icon">
              <img src={LogoImage} alt="EVidya Logo" />
            </div>
          </div>

          <div className="nav-buttons">
            <Link to="/signin">
              <button className="btn btn-outline">Sign In</button>
            </Link>

            <Link to="/Register">
              <button className="btn btn-primary">
                Get Started <ArrowRight size={16} style={{ marginLeft: "8px" }} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>Smart Student Hub</h1>
            <p className="subtitle">Centralized Student Achievement Management</p>
            <p className="description">
              Empower students to showcase their achievements, create digital
              portfolios, and get recognized for their hard work.
            </p>

            <div className="hero-actions">
              <Link to="/Register">
                <button className="btn btn-primary">
                  Start Your Journey{" "}
                  <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                </button>
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImage} alt="Students collaborating" />
          </div>
        </div>
      </section>

{/* =======================
   Video + Ribbon + Boys
======================= */}
<section className="video-ribbon-section">

  {/* Ribbon */}
  <svg
    className="center-ribbon"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="#22c55e"
      d="M0,160 
         C240,120 480,200 720,180 
         C960,160 1200,120 1440,150 
         L1440,260 L0,260 Z"
    />
  </svg>

  {/* Left Boy */}
  <img
    src={boyImg}
    alt="Student left"
    className="ribbon-boy left"
  />

  {/* Right Boy */}
  <img
    src={girlImg}
    alt="Student right"
    className="ribbon-boy right"
  />

  {/* Video */}
  <div className="video-wrapper">
    <video
      className="demo-video"
      src="/evidya.mp4"
      autoPlay
      loop
      muted
      playsInline
    />
  </div>

</section>




      

      {/* Features Section (UNCHANGED) */}
      {/* ... your features section remains exactly same ... */}
      {/* Features Section */}
      <section className="section dark">
        <div className="container text-center">
          <span className="badge">Core Features</span>
          <h2>Everything You Need for Student Success</h2>
          <p className="description">
            From portfolio creation to institutional reporting, we've got every aspect covered.
          </p>

          <div className="card-grid three">
            <div className="card">
              <FileText size={28} color="#60a5fa" />
              <h3>Digital Portfolio</h3>
              <p style={{color:"#000000"}}>Create verified digital portfolios with blockchain authentication.</p>
            </div>
            <div className="card">
              <Trophy size={28} color="#facc15" />
              <h3>Gamification</h3>
              <p style={{color:"#000000"}}>Earn badges, points, and climb leaderboards for achievements.</p>
            </div>
            <div className="card">
              <Shield size={28} color="#22c55e" />
              <h3>Secure Verification</h3>
              <p style={{color:"#000000"}}>Faculty-approved certificates with blockchain security.</p>
            </div>
          </div>

          <div className="card-grid three" style={{ marginTop: "2rem" }}>
            <div className="card">
              <BarChart3 size={28} color="#38bdf8" />
              <h3>Analytics Dashboard</h3>
              <p style={{color:"#000000"}}>Real-time insights into student performance and growth.</p>
            </div>
            <div className="card">
              <Award size={28} color="#f472b6" />
              <h3>Achievement Tracker</h3>
              <p style={{color:"#000000"}}>Upload and manage certifications, workshops, and competitions.</p>
            </div>
            <div className="card">
              <Users size={28} color="#a78bfa" />
              <h3>Faculty Approval</h3>
              <p style={{color:"#000000"}}>Streamlined verification process for all activities.</p>
            </div>
          </div>

          <div className="card-grid three" style={{ marginTop: "2rem" }}>
            <div className="card">
              <Zap size={28} color="#f97316" />
              <h3>Dynamic Dashboard</h3>
              <p style={{color:"#000000"}}>Track all achievements in one centralized platform.</p>
            </div>
            <div className="card">
              <Globe size={28} color="#34d399" />
              <h3>LMS Integration</h3>
              <p style={{color:"#000000"}}>Seamless integration with existing educational systems.</p>
            </div>
            <div className="card">
              <FileText size={28} color="#eab308" />
              <h3>Analytics & Reports</h3>
              <p style={{color:"#000000"}}>Comprehensive insights for NAAC/NIRF/AICTE audits.</p>
            </div>
          </div> 
        </div>
      </section>


      {/* =======================
          How EVidya Works
      ======================= */}
      <section className="section how-it-works">
        <div className="container">
          <h2 className="text-center">How EVidya Works</h2>
          <p className="description text-center">
            A seamless, verified achievement journey — from upload to recognition
          </p>

          <div className="steps-wrapper">
            <SmoothStepCard
              number="1"
              title="Upload Achievements"
              desc="Students upload certificates, internships, workshops, and activities into one secure platform."
              tag="Student"
              colorClass="step-blue"
            />

            <motion.div
              className="step-arrow"
              animate={{ x: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              ➜
            </motion.div>

            <SmoothStepCard
              number="2"
              title="Faculty Verification"
              desc="Faculty verifies authenticity through a simple approval workflow."
              tag="Verified"
              colorClass="step-indigo"
            />

            <motion.div
              className="step-arrow"
              animate={{ x: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              ➜
            </motion.div>

            <SmoothStepCard
              number="3"
              title="Smart Portfolio"
              desc="EVidya auto-generates digital portfolios with verified badges and scores."
              tag="AI Powered"
              colorClass="step-violet"
            />

            <motion.div
              className="step-arrow"
              animate={{ x: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              ➜
            </motion.div>

            <SmoothStepCard
              number="4"
              title="Analytics & Recognition"
              desc="Institutions access dashboards, rankings, and audit-ready reports."
              tag="Institution"
              colorClass="step-green"
            />
          </div>
        </div>
      </section>

      {/* CTA & Footer remain UNCHANGED */}
       {/* CTA */}
      <section className="cta">
        <div className="container text-center">
          <h2>Ready to Transform Achievement Management?</h2>
          <p>Join thousands already using Smart Student Hub to showcase excellence.</p>
          <div className="cta-actions">
            <Link to="/Student">
              <button className="btn btn-light">
                Get Started as Student <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </button>
            </Link>
            <Link to="/Faculty">
              <button className="btn btn-outline-light">Faculty Login</button>
            </Link>
            <Link to="/FAQ">
              <button className="btn btn-light">
                FAQ <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </button>
            </Link>
          </div>
        </div>
      </section>

          {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          
          {/* Column 1: Logo + Description */}
          <div className="footer-col">
            <div className="">
              <span className="logo-text">EVidya</span>
            </div>
            <p className="footer-desc">
              One-Stop Digital Hub for Student Achievements. Empowering students, 
              faculty, and institutions with comprehensive achievement tracking 
              and portfolio generation.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/About">About US</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/problem">Problem Statement</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h4>Contact Info</h4>
            <p>📧 contact@Evidya.edu</p>
            <p>📞 +91 1234567890</p>
            <p>📍 Educational Institution, India</p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p>© 2024 EVidya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
