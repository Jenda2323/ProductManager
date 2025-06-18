//frontend/src/components/Navbar.js - Navigační lišta
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(""); // Stav pro vyhledávací pole

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Volání funkce onSearch předané jako prop pro dynamické filtrování produktů
  };

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : ""}`}>
      {/* Left Section */}
      <h1 className="navbar-title">🎯Najdi produkty⌚</h1>

      {/* Center Section (Search & Create Button) */}
      <div className="navbar-center">
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Vyhledat podle názvu produktu"
            className="search-input"
          />
          <button
            className="search-button"
            onClick={() => onSearch(searchQuery)}
          >
            Hledat
          </button>
        </div>

        {/* Add Product Button */}
        <Link to="/create">
          <button className="add-product-button" title="Přidat produkt">
            ➕
          </button>
        </Link>
      </div>

      {/* Right Section (User Info) */}
      <div className="navbar-right">
        {/* Color Mode Button */}
        <button onClick={toggleTheme} className="theme-toggle-button">
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        {/* User Section */}
        {user ? (
          <div className="user-section">
            {/* User Icon */}
            <div className="user-icon">
              {user.email.charAt(0).toUpperCase()} {/* User Initial */}
            </div>

            {/* Email */}
            <p className="user-email">{user.email}</p>

            {/* Logout Button */}
            <button onClick={logout} className="logout-button">
              Odhlásit se
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="login-button">Přihlásit se</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
