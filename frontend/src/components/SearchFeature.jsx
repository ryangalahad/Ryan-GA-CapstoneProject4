import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import "../styles/SearchFeature.css";

export default function SearchFeature() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Load available countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setSearched(true);

    if (!name.trim() && !country) {
      setError("Please enter a name or select a country");
      return;
    }

    setLoading(true);

    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams();
      if (name.trim()) params.append("name", name);
      if (country) params.append("nationality", country);

      const response = await fetch(
        `http://localhost:3000/api/name-entities/search?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        if (data.data.length === 0) {
          setError("No results found. Try different search parameters.");
        }
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during search");
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (code) => {
    const country = countries.find((c) => c.code === code);
    return country ? country.name : code;
  };

  return (
    <div className="search-feature">
      <h1>Search Individuals</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-fields">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Michael..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Select Country --</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`search-btn ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Results */}
      {searched && results.length > 0 && (
        <div className="results-container">
          <h2>Results ({results.length})</h2>
          <div className="results-grid">
            {results.map((person) => (
              <div key={person.id} className="person-card">
                <div className="card-header">
                  <h3 className="person-name">{person.caption}</h3>
                  <span className="card-badge">
                    {getCountryName(person.nationality)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">First Name:</span>
                    <span className="value">{person.first_name || "N/A"}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Last Name:</span>
                    <span className="value">{person.last_name || "N/A"}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Country:</span>
                    <span className="value">
                      {getCountryName(person.nationality)}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Birthdate:</span>
                    <span className="value">{person.birthdate || "N/A"}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Gender:</span>
                    <span className="value">{person.gender || "N/A"}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{person.address || "N/A"}</span>
                  </div>

                  {person.properties?.topics && (
                    <div className="info-row">
                      <span className="label">Topics:</span>
                      <span className="value">{person.properties.topics}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && results.length === 0 && !error && (
        <div className="alert alert-info">No results found</div>
      )}

      {!searched && (
        <div className="search-placeholder">
          <p>Enter a name and/or select a country to search</p>
        </div>
      )}
    </div>
  );
}
