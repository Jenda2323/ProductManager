// frontend/src/context/AuthContext.js - Kontext pro správu autentizace
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://findproducts-backend.onrender.com/api"
    : "http://localhost:5000/api";

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://janfiser.hys.cz/Projects/findproducts"
    : "http://localhost:3000";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kontrola, zda je uživatel přihlášen
    const token = localStorage.getItem("token");
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Chyba při ověřování uživatele:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await checkAuthStatus(token);
  };

  const loginWithGoogle = () => {
    const scope = "email profile";
    window.location.href = `${API_URL}/users/auth/google?scope=${encodeURIComponent(
      scope
    )}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musí být použit uvnitř AuthProvider");
  }
  return context;
};
