import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductForm = ({ onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    cost: product?.cost || "",
    image: product?.image || "",
    contact: product?.contact || "",
    imageFile: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Název produktu je povinný";
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = "Cena musí být větší než 0";
    }

    if (!formData.image && !formData.imageFile) {
      newErrors.image = "Obrázek je povinný";
    }

    if (!formData.contact) {
      newErrors.contact = "Kontaktní údaje jsou povinné";
    } else if (!validateContact(formData.contact)) {
      newErrors.contact = "Zadejte platný email nebo telefonní číslo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 800;
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with quality 0.7
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Velikost souboru musí být menší než 5MB");
        return;
      }
      try {
        const compressedImage = await compressImage(file);
        setFormData({ ...formData, image: compressedImage, imageFile: file });
        if (errors.image) {
          setErrors({ ...errors, image: null });
        }
      } catch (error) {
        console.error("Chyba při zpracování obrázku:", error);
        toast.error("Chyba při zpracování obrázku. Zkuste jiný.");
      }
    }
  };

  const validateContact = (contact) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d{9}$/; // České telefonní číslo
    return emailPattern.test(contact) || phonePattern.test(contact);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Opravte prosím chyby ve formuláři");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Chyba při odesílání formuláře:", error);
      toast.error("Nepodařilo se odeslat formulář. Zkuste to znovu.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#333",
          }}
        >
          {product ? "Upravit produkt" : "Vytvořit produkt"}
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Název produktu"
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: errors.name ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.name && (
            <p
              style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}
            >
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Cena"
              style={{
                width: "100%",
                padding: "0.8rem",
                fontSize: "1rem",
                borderRadius: "5px",
                border: errors.cost ? "1px solid red" : "1px solid #ccc",
                paddingRight: "3rem",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            >
              Kč
            </span>
          </div>
          {errors.cost && (
            <p
              style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}
            >
              {errors.cost}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="URL obrázku"
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: errors.image ? "1px solid red" : "1px solid #ccc",
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", padding: "0.8rem", marginTop: "1rem" }}
          />
          {errors.image && (
            <p
              style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}
            >
              {errors.image}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Kontakt (email nebo telefon)"
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: errors.contact ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.contact && (
            <p
              style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}
            >
              {errors.contact}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            fontSize: "1.1rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          Uložit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
