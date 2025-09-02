import React, { useState } from "react";
import "../styles/SignIn.css";

const ROLES = ["Student", "Faculty", "Admin"];

const EMAIL_PLACEHOLDER = {
  Student: "your.email@student.edu",
  Faculty: "your.email@faculty.edu",
  Admin: "admin@institution.edu",
};

export default function SignIn() {
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in as ${role}`);
  };

  return (
    <div className="signin-shell">
      {/* Top branding */}
      <div className="brand-wrap">
        <a className="back-link" href="/">
          ← Back to Home
        </a>
        <div className="brand">
          <div className="logo">🏫</div>
          <div className="brand-text">
            <div className="title">Smart Student Hub</div>
            <div className="subtitle">Sign in to your account</div>
          </div>
        </div>
      </div>

      {/* Sign-in card */}
      <div className="card">
        <h2>Welcome Back</h2>
        <p className="meta">Choose your role to continue</p>

        {/* Role selector */}
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

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder={EMAIL_PLACEHOLDER[role]}
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-control">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Sign in as {role}
          </button>
        </form>

        <div className="footer-row">
          Don’t have an account? <a href="#">Contact your institution</a>
        </div>
      </div>
    </div>
  );
}
