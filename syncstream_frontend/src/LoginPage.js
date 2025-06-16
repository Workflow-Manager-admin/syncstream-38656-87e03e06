import React, { useState } from "react";
import "./LoginPage.css";

/**
 * PUBLIC_INTERFACE
 * Login page component for SyncStream.
 * Features responsive design, palette-based colors, clean layout, and branding.
 */
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  // Handles input changes
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  // PUBLIC_INTERFACE
  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder validation logic
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    if (onLogin) onLogin(form.username, form.password);
    // Else do nothing (integration point for auth)
  };

  return (
    <div className="ss-login-bg">
      <div className="ss-login-container">
        <div className="ss-login-branding">
          <span className="ss-login-logo-symbol">&#9654;</span>
          <span className="ss-login-title">SyncStream</span>
        </div>
        <form className="ss-login-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username" className="ss-login-label">
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            className="ss-login-input"
            type="text"
            autoComplete="username"
            placeholder="Enter your username or email"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="ss-login-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="ss-login-input"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="ss-login-error">{error}</div>}
          <button type="submit" className="ss-login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
