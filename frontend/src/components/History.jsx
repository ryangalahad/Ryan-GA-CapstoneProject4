import React from "react";
import "../styles/Cases.css";

export default function History({ history, onRemoveHistory, countries }) {
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

  if (history.length === 0) {
    return (
      <div className="cases-container">
        <h1>History</h1>
        <div className="empty-cases">
          <p>No cleared cases yet. Cleared cases will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cases-container">
      <h1>History ({history.length})</h1>
      <div className="cases-section">
        <h2 className="section-title">Cleared Cases</h2>
        <div className="cases-list">
          {history.map((person) => (
            <div
              key={person.id}
              className="case-row history-row"
              style={{
                backgroundColor: getStatusColor(person.status),
              }}
            >
              <div className="case-info-group">
                <div className="case-field case-name">
                  <span className="case-label">Name:</span>
                  <span className="case-value">{person.caption}</span>
                </div>
                <div className="case-field">
                  <span className="case-label">First:</span>
                  <span className="case-value">
                    {person.first_name || "N/A"}
                  </span>
                </div>
                <div className="case-field">
                  <span className="case-label">Last:</span>
                  <span className="case-value">
                    {person.last_name || "N/A"}
                  </span>
                </div>
                <div className="case-field">
                  <span className="case-label">Country:</span>
                  <span className="case-value">
                    {getCountryName(parseJsonValue(person.nationality))}
                  </span>
                </div>
                <div className="case-field">
                  <span className="case-label">Birthdate:</span>
                  <span className="case-value">
                    {parseJsonValue(person.birthdate)}
                  </span>
                </div>
                <div className="case-field">
                  <span className="case-label">Gender:</span>
                  <span className="case-value">
                    {parseJsonValue(person.gender)}
                  </span>
                </div>
                {person.properties?.topics && (
                  <div className="case-field case-topics">
                    <span className="case-label">Topics:</span>
                    <div className="case-topics-list">
                      {formatTopics(person.properties.topics).map(
                        (topic, idx) => (
                          <span key={idx} className="case-topic-badge">
                            {topic}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
                <div className="case-field case-status">
                  <span className="case-label">Status:</span>
                  <span className="case-value status-readonly">
                    {person.status || "N/A"}
                  </span>
                </div>
              </div>
              <button
                className="remove-case-btn"
                onClick={() => onRemoveHistory(person.id)}
                title="Remove from history"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
