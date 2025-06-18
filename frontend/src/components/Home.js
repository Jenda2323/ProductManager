import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";
import { useTheme } from "../context/ThemeContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://findproducts-backend.onrender.com/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Chyba při načítání produktů:", error);
      toast.error("Nepodařilo se načíst produkty");
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      const token = localStorage.getItem("token");
      if (editingProduct) {
        await axios.put(
          `https://findproducts-backend.onrender.com/api/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Produkt byl úspěšně upraven");
      } else {
        await axios.post(
          "https://findproducts-backend.onrender.com/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Produkt byl úspěšně vytvořen");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Chyba při ukládání produktu:", error);
      toast.error("Nepodařilo se uložit produkt");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Opravdu chcete smazat tento produkt?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://findproducts-backend.onrender.com/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Produkt byl úspěšně smazán");
        fetchProducts();
      } catch (error) {
        console.error("Chyba při mazání produktu:", error);
        toast.error("Nepodařilo se smazat produkt");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`home-container ${isDarkMode ? "dark" : ""}`}>
      <nav className={`home-navbar ${isDarkMode ? "dark" : ""}`}>
        <h1>Seznam produktů</h1>
        <div className="home-navbar-controls">
          <button
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDarkMode ? "dark" : ""}`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          {user && (
            <div className={`user-info ${isDarkMode ? "dark" : ""}`}>
              <div className={`user-avatar ${isDarkMode ? "dark" : ""}`}>
                <img src={user.picture} alt={user.name} />
                <span className={`user-name ${isDarkMode ? "dark" : ""}`}>
                  {user.name}
                </span>
              </div>
              <button onClick={logout} className="logout-btn">
                Odhlásit se
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="home-content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Hledat produkty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-input ${isDarkMode ? "dark" : ""}`}
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="add-product-btn"
          >
            Přidat produkt
          </button>
        </div>

        {isLoading ? (
          <div className={`loading ${isDarkMode ? "dark" : ""}`}>
            Načítání...
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`product-card ${isDarkMode ? "dark" : ""}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className={`product-name ${isDarkMode ? "dark" : ""}`}>
                  {product.name}
                </h3>
                <p className={`product-price ${isDarkMode ? "dark" : ""}`}>
                  {formatPrice(product.cost)}
                </p>
                <p className={`product-contact ${isDarkMode ? "dark" : ""}`}>
                  Kontakt: {product.contact}
                </p>
                <div className="product-actions">
                  <button
                    onClick={() => handleEdit(product)}
                    className="edit-btn"
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="delete-btn"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className={`modal-content ${isDarkMode ? "dark" : ""}`}>
            <ProductForm
              onSubmit={handleProductSubmit}
              product={editingProduct}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="cancel-btn"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
