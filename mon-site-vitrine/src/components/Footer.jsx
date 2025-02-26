// src/components/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectCategory } from '../contexts/ProjectCategoryContext';
import './Footer.css';

function Footer() {
  const { projectCategory } = useProjectCategory();
  const location = useLocation();

  let bgColor;
  // Si on est sur la page Projets, on utilise la couleur définie pour la catégorie active
  if (location.pathname === '/projets') {
    if (projectCategory === "hardware") {
      bgColor = "#4e4e4e"; // jaune clair pour hardware
    } else if (projectCategory === "apprentissage") {
      bgColor = "#ffb300"; // vert clair pour apprentissage
    } else {
      bgColor = "#00a6f9"; // bleu clair pour software
    }
  } else {
    // En dehors de la page Projets, on utilise la couleur par défaut :
    // blanc en mode normal, noir en mode accessibilité.
    if (document.body.classList.contains('accessibility-mode')) {
      bgColor = "#000";
    } else {
      bgColor = "#fff";
    }
  }

  return (
    <footer className="footer" style={{ backgroundColor: bgColor }}>
      <p>© 2023 Mon Site - Tous droits réservés</p>
    </footer>
  );
}

export default Footer;
