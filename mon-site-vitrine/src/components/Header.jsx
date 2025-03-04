import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../images/Logo.png';
import DynamicLogo from './DynamicLogo'; // le chemin selon votre arborescence

function Header() {
  const location = useLocation();
  const menuRef = useRef(null);

  // État pour le menu burger (ouvert/fermé)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // État pour l'indicateur (soulignement)  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Met à jour la position de l'indicateur sur l'onglet actif
  const updateIndicator = () => {
    const activeLink = menuRef.current?.querySelector('.menu-link.active');
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  };

  // Gère la position de la barre d'indication sur le survol
  const handleMouseEnter = (e) => {
    if (!isMenuOpen) { // On peut choisir d'activer ou non ce comportement en mobile
      const { offsetLeft, offsetWidth } = e.target;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  };

  // Au départ du survol, on se repositionne sur l'onglet actif
  const handleMouseLeave = () => {
    if (!isMenuOpen) {
      updateIndicator();
    }
  };

  // Au montage et lors d'un changement de route, positionne l'indicateur sur l'onglet actif
  useEffect(() => {
    updateIndicator();
    // eslint-disable-next-line
  }, [location]);

  // Fermer le menu burger quand on clique sur un lien (optionnel)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          {/* Ici, on affiche le logo dynamique */}
          <DynamicLogo />
        </Link>
      </div>

      {/* Bouton burger pour mobile */}
      <div
        className={`burger-button ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <nav className="nav" ref={menuRef}>
        <ul
          className={`menu ${isMenuOpen ? 'menu-open' : ''}`}
          onMouseLeave={handleMouseLeave}
        >
          <li>
            <Link
              to="/"
              className={`menu-link ${location.pathname === '/' ? 'active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleLinkClick}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/projets"
              className={`menu-link ${location.pathname.startsWith('/projets') ? 'active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleLinkClick}
            >
              Projets
            </Link>
          </li>
          <li>
            <Link
              to="/jeux"
              className={`menu-link ${location.pathname.startsWith('/jeux') ? 'active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleLinkClick}
            >
              Démos
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`menu-link ${location.pathname === '/about' ? 'active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleLinkClick}
            >
              À propos
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`menu-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleLinkClick}
            >
              Contact
            </Link>
          </li>
        </ul>
        <div
          className="menu-indicator"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      </nav>
    </header>
  );
}

export default Header;
