import React, { useState } from "react";
import "../styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ROLES = ["Student", "Faculty"];

const EMAIL_PLACEHOLDER = {
  Student: "your.email@gmail.com",
  Faculty: "your.email@gmail.com",
};

export default function SignIn() {
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let url = "";

      if (role === "Student") {
        url = "http://localhost:5000/api/students/login";
      } else if (role === "Faculty") {
        url = "http://localhost:5000/api/faculty/login";
      }

      const response = await axios.post(url, form);

      // Save token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "Student") navigate("/student-dashboard");
      if (role === "Faculty") navigate("/faculty-dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }

    setLoading(false);
  };

  return (
    <div className="signin-shell split-layout">
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

            {error && <p className="error-text">{error}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : `Sign in as ${role}`}
            </button>
          </form>

          <div className="footer-row">
            <Link to="/register">Don’t have an account? Register here</Link>
          </div>
        </div>
      </div>

      {/* Right Panel unchanged */}
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