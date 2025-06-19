import React from "react";
import "./ProductCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product, onDelete, onEdit }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = product.image;
    link.download = product.name + ".jpg"; //  upravit příponu podle formátu obrázku
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="card-content">
        <h3>{product.name}</h3>
        <p>Cena: {product.cost} Kč</p>
        <p>Kontakt: {product.contact}</p>
        <div className="card-actions">
          <button className="button" onClick={() => onEdit(product)}>
            <FontAwesomeIcon icon={faEdit} /> Upravit
          </button>
          <button className="button" onClick={() => onDelete(product._id)}>
            <FontAwesomeIcon icon={faTrash} /> Smazat
          </button>
          {/* Download icon for image */}
          <button className="button" onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Stáhnout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
