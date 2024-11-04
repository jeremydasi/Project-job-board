import React from "react";
import '../../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>À propos</h4>
          <p>
            La plateforme numéro un pour trouver des emplois en ligne ! Nous
            aidons les professionnels à trouver les meilleures opportunités
            d'emploi partout dans le monde.
          </p>
        </div>
        <div className="footer-section">
          <h4>Liens utiles</h4>
          <ul>
            <li>
              <a href="/contact">Contactez-nous</a>
            </li>
            <li>
              <a href="/privacy">Politique de confidentialité</a>
            </li>
            <li>
              <a href="/terms">Conditions d'utilisation</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <h5>
          &copy; {new Date().getFullYear()} Ice Job. Tous droits réservés.
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
