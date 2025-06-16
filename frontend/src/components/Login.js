import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const { isDarkMode } = useTheme();

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            color: isDarkMode ? "#fff" : "#333",
          }}
        >
          FindProducts
        </h1>
        <p
          style={{
            marginBottom: "2rem",
            color: isDarkMode ? "#ccc" : "#666",
            fontSize: "1.1rem",
          }}
        >
          Přihlaste se pro přístup k vašemu účtu
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: "20px", height: "20px" }}
          />
          Přihlásit se pomocí Google
        </button>
      </div>
    </div>
  );
};

export default Login;
