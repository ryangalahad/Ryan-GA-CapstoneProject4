import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import authService from "./services/authService";
import "./App.css";

function App() {
  const [LoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    try {
      if (authService.isLoggedIn()) {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      // Clear auth data on error
      authService.logout();
      setLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            LoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            LoggedIn ? (
              <Dashboard user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={LoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
