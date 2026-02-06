import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggle={toggleAuthMode} onLoginSuccess={onLoginSuccess} />
      ) : (
        <Register
          onToggle={toggleAuthMode}
          onRegisterSuccess={toggleAuthMode}
        />
      )}
    </>
  );
}
