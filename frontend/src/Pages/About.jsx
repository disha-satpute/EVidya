import React, { useEffect } from "react";
import "../styles/About.css";
import boyImg from "../assets/boy.png";
import girlImg from "../assets/girl.png";
import dishaImg from "../assets/disha.png";
import nehaImg from "../assets/neha.png";
import swaminiImg from "../assets/swamini.png";
import vaishnaviImg from "../assets/vaishnavi.png";

const About = () => {

  // ✅ FIX: Always start page from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="about-wrapper">

      {/* HERO */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>Building Opportunities for Every Student</h1>
          <p>
            Evidya is a modern education platform connecting students with
            scholarships, real-world projects, and skill-based learning—
            all in one trusted ecosystem.
          </p>
        </div>

        {/* Orbiting Emojis */}
        <div className="emoji-orbit">
          <span className="orbit-emoji e1">🎓</span>
          <span className="orbit-emoji e2">💡</span>
          <span className="orbit-emoji e3">📚</span>
          <span className="orbit-emoji e4">🚀</span>
        </div>
      </div>

      {/* WHO WE ARE */}
      <div className="about-section split">
        <div>
          <h2>Who We Are</h2>
          <p>
            Evidya was created with one clear purpose—to simplify how students
            access educational opportunities. We bridge the gap between learning,
            funding, and practical experience so students can focus on growth,
            not confusion.
          </p>
        </div>
        <div className="info-box">
          <h3>Student-First Platform</h3>
          <p>
            Designed to guide, support, and empower learners at every stage of
            their academic journey.
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="about-section center">
        <h2>What Makes Evidya Different</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎓 Verified Scholarships</h3>
            <p>
              Access trusted and updated scholarship opportunities tailored to
              different academic backgrounds.
            </p>
          </div>

          <div className="feature-card">
            <h3>💡 Real-World Projects</h3>
            <p>
              Gain hands-on experience through academic, industry, and research
              projects that matter.
            </p>
          </div>

          <div className="feature-card">
            <h3>📜 Skill & Career Growth</h3>
            <p>
              Build practical skills, earn certifications, and strengthen your
              professional profile.
            </p>
          </div>
        </div>
      </div>

      {/* MISSION / VISION */}
      <div className="about-section dual">
        <div className="dual-card">
          <h2>Our Mission</h2>
          <p>
            To democratize access to education by connecting students with
            meaningful opportunities that shape confident, capable professionals.
          </p>
        </div>

        <div className="dual-card">
          <h2>Our Vision</h2>
          <p>
            To become India’s most trusted student opportunity platform where
            education meets real impact.
          </p>
        </div>
      </div>

      {/* TEAM MEMBERS */}
<div className="about-section center team-section">
  <h2>Meet Our Team</h2>
  <p className="team-subtitle">The minds behind Evidya</p>

  <div className="team-row">
    <div className="team-card">
      <img src={swaminiImg} alt="Swamini Mote" />
      <h4>Swamini Mote</h4>
    </div>

    <div className="team-card">
      <img src={nehaImg} alt="Neha Shinde" />
      <h4>Neha Shinde</h4>
    </div>

    <div className="team-card">
      <img src={vaishnaviImg} alt="Vaishnavi Phad" />
      <h4>Vaishnavi Phad</h4>
    </div>

    <div className="team-card">
      <img src={dishaImg} alt="Disha Satpute" />
      <h4>Disha Satpute</h4>
    </div>
  </div>
</div>

      {/* IMPACT */}
      <div className="about-impact">
        <h2>Empowering the Next Generation</h2>
        <p>
          At Evidya, we believe talent exists everywhere—opportunity should too.
          Our platform is built to ensure no student is left behind.
        </p>
      </div>

    </section>
  );
};

export default About;
