import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";
import Home from "./components/Home";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://findproducts-backend.onrender.com/api";
const BASE_URL = "https://janfiser.hys.cz/Projects/findproducts";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Načítání...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      console.log("Našel jsem token v URL:", token);
      login(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, login]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
