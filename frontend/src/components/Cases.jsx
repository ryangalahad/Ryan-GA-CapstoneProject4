import React from "react";
import "../styles/Cases.css";

export default function Cases({
  cases,
  onRemoveCase,
  onStatusChange,
  onClearCase,
  onReassign,
  countries,
  officers,
  user,
}) {
  const getCountryName = (code) => {
    if (!code) return "N/A";
    const country = countries.find((c) => c.code === code);
    return country ? `${country.name} (${code})` : code;
  };

  const parseJsonValue = (value) => {
    if (!value) return "N/A";

    if (typeof value === "string") {
      // Handle PostgreSQL array syntax like {"value"} or {value}
      if (value.startsWith("{") && value.endsWith("}")) {
        // Remove the curly braces
        let cleaned = value.slice(1, -1);
        // Remove quotes if present
        cleaned = cleaned.replace(/^"(.*)"$/, "$1");
        return cleaned || "N/A";
      }

      try {
        // Try to parse as JSON
        const parsed = JSON.parse(value);
        return typeof parsed === "string" ? parsed : String(parsed);
      } catch (e) {
        return value;
      }
    }

    return String(value);
  };

  const formatTopics = (topicsData) => {
    if (!topicsData) return [];

    if (Array.isArray(topicsData)) {
      return topicsData.map((topic) =>
        typeof topic === "string"
          ? topic.toUpperCase()
          : String(topic).toUpperCase(),
      );
    }

    if (typeof topicsData === "string") {
      try {
        const parsed = JSON.parse(topicsData);
        if (Array.isArray(parsed)) {
          return parsed.map((topic) =>
            typeof topic === "string"
              ? topic.toUpperCase()
              : String(topic).toUpperCase(),
          );
        }
        return [topicsData.toUpperCase()];
      } catch (e) {
        return [topicsData.toUpperCase()];
      }
    }

    return [];
  };

  if (cases.length === 0) {
    return (
      <div className="cases-container">
        <h1>Cases</h1>
        <div className="empty-cases">
          <p>
            No cases added yet. Search for individuals and add them to your
            cases.
          </p>
        </div>
      </div>
    );
  }

  const isManager = user?.role === "manager";

  // For managers, only show pending and flagged cases
  const displayCases = isManager
    ? cases.filter(
        (c) => c.status === "Pending" || c.status?.startsWith("Flag:"),
      )
    : cases;

  if (displayCases.length === 0 && isManager) {
    return (
      <div className="cases-container">
        <h1>Cases</h1>
        <div className="empty-cases">
          <p>No pending or flagged cases to review.</p>
        </div>
      </div>
    );
  }

  // Organize cases by status
  const activeCases = displayCases.filter((c) => c.status === "Select Status");
  const pendingCases = displayCases.filter((c) => c.status === "Pending");
  const flaggedCases = displayCases
    .filter((c) => c.status?.startsWith("Flag:"))
    .sort((a, b) => {
      // Sort by flag number descending (FLAG 5 first, FLAG 1 last)
      const flagA = parseInt(a.status.split(":")[1]);
      const flagB = parseInt(b.status.split(":")[1]);
      return flagB - flagA;
    });

  // Group cases by officer for manager view
  const groupByOfficer = (casesList) => {
    const grouped = {};
    casesList.forEach((c) => {
      const officerName = c.officer_name || "Unknown Officer";
      if (!grouped[officerName]) {
        grouped[officerName] = [];
      }
      grouped[officerName].push(c);
    });
    return grouped;
  };

  const getStatusColor = (status) => {
    if (!status || !status.startsWith("Flag:")) return "";
    const flagNum = parseInt(status.split(":")[1]);
    const colors = [
      "#FFE5E5", // Flag:1 - Very light red
      "#FFD1D1", // Flag:2 - Light red
      "#FFBABA", // Flag:3 - Medium light red
      "#FFA3A3", // Flag:4 - Medium red
      "#FF8C8C", // Flag:5 - Medium dark red
    ];
    return colors[flagNum - 1] || "";
  };

  const renderCaseRow = (
    person,
    showClearButton = false,
    showOfficer = false,
  ) => (
    <div
      key={person.id}
      className="case-row"
      style={{
        backgroundColor: getStatusColor(person.status),
      }}
    >
      <div className="case-info-group">
        {showOfficer && (
          <div className="case-field case-officer">
            <span className="case-label">Officer:</span>
            <span className="case-value">
              {person.officer_name || "Unknown"}
            </span>
          </div>
        )}
        <div className="case-field case-name">
          <span className="case-label">Name:</span>
          <span className="case-value">{person.caption}</span>
        </div>
        <div className="case-field">
          <span className="case-label">First:</span>
          <span className="case-value">{person.first_name || "N/A"}</span>
        </div>
        <div className="case-field">
          <span className="case-label">Last:</span>
          <span className="case-value">{person.last_name || "N/A"}</span>
        </div>
        <div className="case-field">
          <span className="case-label">Country:</span>
          <span className="case-value">
            {getCountryName(parseJsonValue(person.nationality))}
          </span>
        </div>
        <div className="case-field">
          <span className="case-label">Birthdate:</span>
          <span className="case-value">{parseJsonValue(person.birthdate)}</span>
        </div>
        <div className="case-field">
          <span className="case-label">Gender:</span>
          <span className="case-value">{parseJsonValue(person.gender)}</span>
        </div>
        {person.properties?.topics && (
          <div className="case-field case-topics">
            <span className="case-label">Topics:</span>
            <div className="case-topics-list">
              {formatTopics(person.properties.topics).map((topic, idx) => (
                <span key={idx} className="case-topic-badge">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="case-field case-status">
          <span className="case-label">Status:</span>
          <select
            className="status-select"
            value={person.status || "Select Status"}
            onChange={(e) =>
              onStatusChange(person.id, person.officer_id, e.target.value)
            }
          >
            <option value="Select Status">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Flag:1">Flag: 1</option>
            <option value="Flag:2">Flag: 2</option>
            <option value="Flag:3">Flag: 3</option>
            <option value="Flag:4">Flag: 4</option>
            <option value="Flag:5">Flag: 5</option>
          </select>
        </div>
      </div>
      <div className="case-row-actions">
        {isManager && officers && officers.length > 0 && (
          <div className="reassign-field">
            <span className="reassign-label">Reassign:</span>
            <select
              className="reassign-select"
              onChange={(e) => {
                if (e.target.value) {
                  onReassign(person.id, person.officer_id, e.target.value);
                  e.target.value = ""; // Reset dropdown
                }
              }}
            >
              <option value="">-- Select Officer --</option>
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {showClearButton && (
          <button
            className="clear-case-btn"
            onClick={() => onClearCase(person.id, person.officer_id)}
            title="Move to history"
          >
            Clear
          </button>
        )}
        <button
          className="remove-case-btn"
          onClick={() => onRemoveCase(person.id)}
          title="Remove from cases"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="cases-container">
      <h1>Cases ({displayCases.length})</h1>

      {/* For Officers: Show all sections including Active */}
      {!isManager && (
        <>
          {/* Active Cases Section */}
          {activeCases.length > 0 && (
            <div className="cases-section">
              <h2 className="section-title">
                Active Cases ({activeCases.length})
              </h2>
              <div className="cases-list">
                {activeCases.map((person) =>
                  renderCaseRow(person, false, false),
                )}
              </div>
            </div>
          )}

          {/* Pending Cases Section */}
          {pendingCases.length > 0 && (
            <div className="cases-section pending-section">
              <h2 className="section-title">Pending ({pendingCases.length})</h2>
              <div className="cases-list">
                {pendingCases.map((person) =>
                  renderCaseRow(person, true, false),
                )}
              </div>
            </div>
          )}

          {/* Flagged Cases Section */}
          {flaggedCases.length > 0 && (
            <div className="cases-section flagged-section">
              <h2 className="section-title">Flagged ({flaggedCases.length})</h2>
              <div className="cases-list">
                {flaggedCases.map((person) =>
                  renderCaseRow(person, true, false),
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* For Managers: Show grouped by officer */}
      {isManager && (
        <>
          {/* Pending Cases Section - Grouped by Officer */}
          {pendingCases.length > 0 && (
            <div className="cases-section pending-section">
              <h2 className="section-title">Pending ({pendingCases.length})</h2>
              {Object.entries(groupByOfficer(pendingCases)).map(
                ([officerName, cases]) => (
                  <div key={officerName} className="officer-group">
                    <h3 className="officer-name">Officer: {officerName}</h3>
                    <div className="cases-list">
                      {cases.map((person) =>
                        renderCaseRow(person, true, false),
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Flagged Cases Section - Grouped by Officer */}
          {flaggedCases.length > 0 && (
            <div className="cases-section flagged-section">
              <h2 className="section-title">Flagged ({flaggedCases.length})</h2>
              {Object.entries(groupByOfficer(flaggedCases)).map(
                ([officerName, cases]) => (
                  <div key={officerName} className="officer-group">
                    <h3 className="officer-name">Officer: {officerName}</h3>
                    <div className="cases-list">
                      {cases.map((person) =>
                        renderCaseRow(person, true, false),
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
