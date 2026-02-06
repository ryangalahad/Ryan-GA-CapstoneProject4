import React, { useState } from "react";
import authService from "../services/authService";
import "../styles/Auth.css";

export default function Login({ onToggle, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );

      if (response.success) {
        setSuccess("Login successful!");
        setFormData({
          email: "",
          password: "",
        });

        // Call callback after 1 second
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(response.user);
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your compliance account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading && <span className="spinner"></span>}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <a onClick={onToggle} style={{ cursor: "pointer" }}>
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
