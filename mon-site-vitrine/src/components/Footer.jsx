import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectCategory } from '../contexts/ProjectCategoryContext';
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
        backgroundColor: 'transparent',
        '--footer-border-color': borderColor
      }}
    >
      <p>© 2023 Mon Site - Tous droits réservés</p>
    </footer>
  );
}

export default Footer;
