// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from "../images/Logo.png";

function Header() {
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  // Appliquer la classe sur le body pour modifier le style global
  useEffect(() => {
    if (accessibilityMode) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
  }, [accessibilityMode]);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul className="menu">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/projets">Projets</Link></li>
          <li><Link to="/jeux">Jeux</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        {/* Bouton d'accessibilité */}
        <button
          className="accessibility-btn"
          onClick={() => setAccessibilityMode(prev => !prev)}
          title="Mode Accessibilité"
        >
          {accessibilityMode ? "Normal" : "Accessibilité"}
        </button>
      </div>
    </header>
  );
}

export default Header;
