import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProductForm.css";

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

  // Reset form when product changes
  useEffect(() => {
    setFormData({
      name: product?.name || "",
      cost: product?.cost || "",
      image: product?.image || "",
      contact: product?.contact || "",
      imageFile: null,
    });
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Název produktu je povinný";
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = "Cena musí být větší než 0";
    }

    if (!formData.image && !formData.imageFile) {
      newErrors.image = "Obrázek je povinný - zadejte URL nebo vyberte soubor";
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
    // Vymazání chyby, když uživatel začne psát
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Výpočet nových rozměrů při zachování poměru stran
          let { width, height } = img;
          const maxSize = 800;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Převod na base64
          const base64Image = canvas.toDataURL("image/jpeg", 0.7);
          setFormData({
            ...formData,
            image: base64Image,
            imageFile: file,
          });

          // Vymazání chyby obrázku
          if (errors.image) {
            setErrors({ ...errors, image: null });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const validateContact = (contact) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <h2 className="product-form-title">
          {product ? "Upravit produkt" : "Vytvořit produkt"}
        </h2>

        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Název produktu"
            className={`form-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="cost" className="form-label">
            Cena
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="Cena v Kč"
            className={`form-input ${errors.cost ? "error" : ""}`}
          />
          {errors.cost && <p className="form-error">{errors.cost}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Obrázek produktu
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="URL obrázku nebo nahrajte soubor"
            className={`form-input ${errors.image ? "error" : ""}`}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <label htmlFor="file-upload" className="form-label">
              Nebo nahrajte soubor:
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
          {formData.image && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <img
                src={formData.image}
                alt="Náhled"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
          {errors.image && <p className="form-error">{errors.image}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Kontakt (email nebo telefon)"
            className={`form-input ${errors.contact ? "error" : ""}`}
          />
          {errors.contact && <p className="form-error">{errors.contact}</p>}
        </div>

        <button type="submit" className="submit-button">
          Uložit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
