import React, { useState } from "react";
import SearchFeature from "./SearchFeature";
import "../styles/Dashboard.css";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="dashboard-container">
      {/* Left Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Compliance Officer</h2>
          <p className="user-info">{user?.name || "User"}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-label">Search</span>
          </button>

          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>

          <button
            className={`nav-item ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <span className="nav-icon">ℹ️</span>
            <span className="nav-label">About</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeTab === "search" && <SearchFeature />}
        {activeTab === "profile" && <ProfileTab user={user} />}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <div className="tab-content">
      <h1>Your Profile</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Name:</label>
          <p>{user?.name}</p>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <p>{user?.email}</p>
        </div>
        <div className="profile-field">
          <label>Gender:</label>
          <p>{user?.gender}</p>
        </div>
        <div className="profile-field">
          <label>Role:</label>
          <p>{user?.role}</p>
        </div>
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="tab-content">
      <h1>About This Platform</h1>
      <div className="about-content">
        <p>
          Welcome to the Compliance Officer Portal. This platform helps you
          search and monitor sanctioned individuals and entities.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>Search for individuals by name and country</li>
          <li>View detailed compliance information</li>
          <li>Track sanctions status and topics</li>
          <li>Access biographical data</li>
        </ul>
      </div>
    </div>
  );
}
