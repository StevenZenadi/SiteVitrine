import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../images/Logo.png';

function Header() {
  const location = useLocation();
  const menuRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Met à jour la position de l'indicateur sur l'onglet actif
  const updateIndicator = () => {
    const activeLink = menuRef.current.querySelector('.menu-link.active');
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  };

  // Lors du survol d'un lien, déplace l'indicateur sur ce lien
  const handleMouseEnter = (e) => {
    const { offsetLeft, offsetWidth } = e.target;
    setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
  };

  // Lors du départ du survol, repositionne l'indicateur sur l'onglet actif
  const handleMouseLeave = () => {
    updateIndicator();
  };

  // Au montage et lors d'un changement de route, positionne l'indicateur sur l'onglet actif
  useEffect(() => {
    updateIndicator();
  }, [location]);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav" ref={menuRef}>
        <ul className="menu" onMouseLeave={handleMouseLeave}>
          <li>
            <Link
              to="/"
              className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
              onMouseEnter={handleMouseEnter}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/projets"
              className={`menu-link ${location.pathname === "/projets" ? "active" : ""}`}
              onMouseEnter={handleMouseEnter}
            >
              Projets
            </Link>
          </li>
          <li>
            <Link
              to="/jeux"
              className={`menu-link ${location.pathname === "/jeux" ? "active" : ""}`}
              onMouseEnter={handleMouseEnter}
            >
              Jeux
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`menu-link ${location.pathname === "/about" ? "active" : ""}`}
              onMouseEnter={handleMouseEnter}
            >
              À propos
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`menu-link ${location.pathname === "/contact" ? "active" : ""}`}
              onMouseEnter={handleMouseEnter}
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="menu-indicator" style={{ left: indicatorStyle.left, width: indicatorStyle.width }} />
      </nav>
      <div className="header-right">
        {/* Autres éléments du header, comme le bouton accessibilité */}
      </div>
    </header>
  );
}

export default Header;
