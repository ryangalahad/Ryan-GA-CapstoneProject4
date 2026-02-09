import React, { useState, useEffect } from "react";
import SearchFeature from "./SearchFeature";
import Cases from "./Cases";
import History from "./History";
import "../styles/Dashboard.css";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("search");
  const [allCases, setAllCases] = useState([]);
  const [history, setHistory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [hasLoadedCases, setHasLoadedCases] = useState(false);

  const isManager = user?.role === "manager";

  // Load all cases from global localStorage on mount
  useEffect(() => {
    const savedCases = localStorage.getItem("all_cases");
    const savedHistory = localStorage.getItem(`history_${user?.id}`);
    if (savedCases) {
      try {
        setAllCases(JSON.parse(savedCases));
      } catch (e) {
        console.error("Error loading cases:", e);
      }
    }
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading history:", e);
      }
    }
    setHasLoadedCases(true);
  }, [user?.id]);

  // Save all cases to global localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (hasLoadedCases) {
      localStorage.setItem("all_cases", JSON.stringify(allCases));
    }
  }, [allCases, hasLoadedCases]);

  // Save history to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (hasLoadedCases && user?.id) {
      localStorage.setItem(`history_${user?.id}`, JSON.stringify(history));
    }
  }, [history, user?.id, hasLoadedCases]);

  // Load countries and users
  useEffect(() => {
    fetchCountries();
    if (isManager) {
      fetchOfficers();
    }
  }, [isManager]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/name-entities/countries`,
      );
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchOfficers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3000/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        // Filter to only show officers
        setOfficers(data.data.filter((u) => u.role === "officer"));
      }
    } catch (err) {
      console.error("Error fetching officers:", err);
    }
  };

  // Filter cases based on user role
  const cases = isManager
    ? allCases.filter(
        (c) => c.status === "Pending" || c.status?.startsWith("Flag:"),
      )
    : allCases.filter((c) => c.officer_id === user?.id);

  const handleAddToCase = (person) => {
    // Check if person is already in cases
    if (allCases.some((c) => c.id === person.id && c.officer_id === user?.id)) {
      alert("This person is already in your cases.");
      return;
    }
    // Add person with default status and officer info
    const personWithStatus = {
      ...person,
      status: "Select Status",
      officer_name: user?.name || "Unknown",
      officer_id: user?.id || null,
    };
    setAllCases([...allCases, personWithStatus]);
  };

  const handleRemoveCase = (personId) => {
    setAllCases(
      allCases.filter((c) => !(c.id === personId && c.officer_id === user?.id)),
    );
  };

  const handleStatusChange = (personId, officerId, newStatus) => {
    setAllCases(
      allCases.map((c) =>
        c.id === personId && c.officer_id === officerId
          ? { ...c, status: newStatus }
          : c,
      ),
    );
  };

  const handleReassign = (personId, currentOfficerId, newOfficerId) => {
    const newOfficer = officers.find((o) => o.id === parseInt(newOfficerId));
    if (!newOfficer) return;

    setAllCases(
      allCases.map((c) =>
        c.id === personId && c.officer_id === currentOfficerId
          ? {
              ...c,
              officer_id: newOfficer.id,
              officer_name: newOfficer.name,
            }
          : c,
      ),
    );
  };

  const handleClearCase = (personId, officerId) => {
    const person = allCases.find(
      (c) => c.id === personId && c.officer_id === officerId,
    );
    if (person) {
      // Move to history
      setHistory([...history, person]);
      // Remove from cases
      setAllCases(
        allCases.filter(
          (c) => !(c.id === personId && c.officer_id === officerId),
        ),
      );
    }
  };

  const handleRemoveHistory = (personId) => {
    setHistory(history.filter((h) => h.id !== personId));
  };

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
            className={`nav-item ${activeTab === "cases" ? "active" : ""}`}
            onClick={() => setActiveTab("cases")}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">Cases</span>
            {cases.length > 0 && (
              <span className="case-count">{cases.length}</span>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <span className="nav-icon">📜</span>
            <span className="nav-label">History</span>
            {history.length > 0 && (
              <span className="case-count">{history.length}</span>
            )}
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
        {activeTab === "search" && (
          <SearchFeature onAddToCase={handleAddToCase} />
        )}
        {activeTab === "cases" && (
          <Cases
            cases={cases}
            onRemoveCase={handleRemoveCase}
            onStatusChange={handleStatusChange}
            onClearCase={handleClearCase}
            onReassign={handleReassign}
            countries={countries}
            officers={officers}
            user={user}
          />
        )}
        {activeTab === "history" && (
          <History
            history={history}
            onRemoveHistory={handleRemoveHistory}
            countries={countries}
          />
        )}
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
