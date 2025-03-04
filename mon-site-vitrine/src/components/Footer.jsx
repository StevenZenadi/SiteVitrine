// src/components/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectCategory } from '../contexts/ProjectCategoryContext';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const { projectCategory } = useProjectCategory();
  const location = useLocation();

  let bgColor, borderColor;
  // Sur la page Projets, la couleur dépend de la catégorie
  if (location.pathname === '/projets') {
    if (projectCategory === "hardware") {
      bgColor = "#fff8cc";
      borderColor = "#fff8cc";
    } else if (projectCategory === "apprentissage") {
      bgColor = "#ccffcc";
      borderColor = "#ccffcc";
    } else {
      bgColor = "#cceeff";
      borderColor = "#cceeff";
    }
  } else {
    // Hors de Projets : par défaut blanc ou noir en mode accessibilité
    if (document.body.classList.contains('accessibility-mode')) {
      bgColor = "#000";
      borderColor = "#000";
    } else {
      bgColor = "#fff";
      borderColor = "#fff";
    }
  }

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: bgColor,
        '--footer-border-color': borderColor,
      }}
    >
      <div className="footer-content">
        <p className="footer-slogan">
          Créé avec passion par Steven Zenadi
        </p>
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/mon-profil"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaLinkedin className="social-icon" />
          </a>
          <a
            href="https://github.com/mon-profil"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaGithub className="social-icon" />
          </a>
          <a
            href="https://twitter.com/mon-profil"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaTwitter className="social-icon" />
          </a>
        </div>
        <p className="footer-copy">
          © 2025 Mon Site - Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

export default Footer;
