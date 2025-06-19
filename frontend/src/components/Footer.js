import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>FindProducts</h3>
          <p>Vaše aplikace pro správu a vyhledávání produktů</p>
        </div>

        <div className="footer-section">
          <h4>Užitečné odkazy</h4>
          <ul>
            <li>
              <a href="/">Domů</a>
            </li>
            <li>
              <a
                href="https://github.com/Jenda2323/ProductManager"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Jan Fišer - FindProducts. Všechna práva
          vyhrazena.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
