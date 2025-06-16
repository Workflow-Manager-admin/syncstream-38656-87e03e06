import React, { useState } from "react";
import "./LoginPage.css";

/*
 * PUBLIC_INTERFACE
 * LoginPage: SyncStream branded login UI, closely matched to design reference.
 * Responsive, high-fidelity. Plug in auth via onLogin(username, password).
 */
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  // Called on field change
  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  // PUBLIC_INTERFACE
  // Called on submit; forwards data to onLogin
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    if (onLogin) onLogin(form.username, form.password);
  };

  return (
    <div className="ss-login__bg">
      <div className="ss-login__box">
        <div className="ss-login__branding" tabIndex={-1}>
          <span className="ss-login__logo-symbol">&#9654;</span>
          <span className="ss-login__brand-title">SyncStream</span>
        </div>
        <form className="ss-login__form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="ss-login-username" className="ss-login__label">
            Username or Email
          </label>
          <input
            id="ss-login-username"
            name="username"
            className="ss-login__input"
            type="text"
            placeholder="Enter your username or email"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label htmlFor="ss-login-password" className="ss-login__label">
            Password
          </label>
          <input
            id="ss-login-password"
            name="password"
            className="ss-login__input"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && (
            <div className="ss-login__error" aria-live="polite">
              {error}
            </div>
          )}
          <button className="ss-login__button" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
