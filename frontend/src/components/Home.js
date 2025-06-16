import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";
import { useTheme } from "../context/ThemeContext";

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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
        color: isDarkMode ? "#fff" : "#333",
      }}
    >
      <nav
        style={{
          backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
          padding: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Seznam produktů</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "0.5rem",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = isDarkMode
                ? "#4a4a4a"
                : "#e0e0e0")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: isDarkMode ? "#2d2d2d" : "#f8f9fa",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "2px solid " + (isDarkMode ? "#4a4a4a" : "#e0e0e0"),
                  }}
                />
                <span
                  style={{
                    color: isDarkMode ? "#fff" : "#333",
                    fontWeight: "500",
                  }}
                >
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#dc3545")
                }
              >
                Odhlásit se
              </button>
            </div>
          )}
        </div>
      </nav>

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Hledat produkty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flex: 1,
              backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
              color: isDarkMode ? "#fff" : "#333",
            }}
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Přidat produkt
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Načítání...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                  }}
                />
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    color: isDarkMode ? "#ccc" : "#666",
                  }}
                >
                  {formatPrice(product.cost)}
                </p>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    color: isDarkMode ? "#ccc" : "#666",
                  }}
                >
                  Kontakt: {product.contact}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      flex: 1,
                    }}
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <ProductForm
              onSubmit={handleProductSubmit}
              product={editingProduct}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
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
