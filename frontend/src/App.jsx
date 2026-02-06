import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import authService from "./services/authService";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isLoggedIn()) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <nav className="app-navbar">
        <div className="navbar-content">
          <h2>Compliance Platform</h2>
          <div className="user-info">
            <span>Welcome, {currentUser?.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="app-content">
        <div className="dashboard">
          <h1>Dashboard</h1>
          <div className="user-profile">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {currentUser?.name}
              </p>
              <p>
                <strong>Email:</strong> {currentUser?.email}
              </p>
              <p>
                <strong>Gender:</strong> {currentUser?.gender}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span className="role-badge">{currentUser?.role}</span>
              </p>
            </div>
          </div>

          <div className="features">
            <h2>Available Features</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>Search Entities</h3>
                <p>Search through 40,000 sanctioned persons and entities</p>
                <button className="feature-btn">Coming Soon</button>
              </div>

              <div className="feature-card">
                <h3>Case Management</h3>
                <p>Manage compliance cases and investigations</p>
                <button className="feature-btn">Coming Soon</button>
              </div>

              <div className="feature-card">
                <h3>Reports</h3>
                <p>Generate compliance reports and analytics</p>
                <button className="feature-btn">Coming Soon</button>
              </div>

              <div className="feature-card">
                <h3>Settings</h3>
                <p>Manage your account and preferences</p>
                <button className="feature-btn">Coming Soon</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
