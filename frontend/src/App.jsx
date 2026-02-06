import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import authService from "./services/authService";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    try {
      if (authService.isLoggedIn()) {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      // Clear auth data on error
      authService.logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
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

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;
