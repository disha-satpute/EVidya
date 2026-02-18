import React, { useState } from "react";
import "../styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom";

const ROLES = ["Student", "Faculty", "Admin"];

const EMAIL_PLACEHOLDER = {
  Student: "your.email@gmail.com",
  Faculty: "your.email@gmail.com",
  Admin: "admin@institution.edu",
};

export default function SignIn() {
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (role === "Student") navigate("/student-dashboard");
    else if (role === "Faculty") navigate("/faculty-dashboard");
    else if (role === "Admin") navigate("/admin-dashboard");
  };

  return (
    <div className="signin-shell split-layout">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="brand-wrap">
          <Link className="back-link" to="/">← Back to Home</Link>
          <div className="brand">
            <div className="logo">🏫</div>
            <div className="brand-text">
              <div className="title">Smart Student Hub</div>
              <div className="subtitle">Sign in to your account</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Welcome Back</h2>
          <p className="meta">Select your role to continue</p>

          <div className="segmented">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                className={`seg-btn ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-control">
              <input
                type="email"
                name="email"
                placeholder={EMAIL_PLACEHOLDER[role]}
                value={form.email}
                onChange={onChange}
                required
              />
              <label>Email</label>
            </div>

            <div className="form-control">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
              <label>Password</label>
            </div>

            <button className="submit-btn" type="submit">
              Sign in as {role}
            </button>
          </form>

          <div className="footer-row">
            <Link to="/register">Don’t have an account? Register here</Link>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>Why Choose Smart Student Hub?</h2>
        <p>Your all-in-one academic ecosystem</p>

        <div className="feature-grid-anim">
          <div className="feature-box b1">
            <h4>🎓 Trusted Platform</h4>
            <span>Verified resources and secure access</span>
          </div>

          <div className="feature-box b2">
            <h4>📚 Smart Learning</h4>
            <span>Personalized academic support</span>
          </div>

          <div className="feature-box b3">
            <h4>💼 Career Support</h4>
            <span>Projects & guidance for growth</span>
          </div>

          <div className="feature-box b4">
            <h4>⚡ Fast & Secure</h4>
            <span>Reliable and modern system</span>
          </div>
        </div>
      </div>
    </div>
  );
}