// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import DynamicLogo from './DynamicLogo';
import LogoSpinner from '../components/LogoSpinner';

function Header({ apiStatus }) {
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = () => {
    const activeLink = menuRef.current?.querySelector('.menu-link.active');
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  };

  const handleMouseEnter = (e) => {
    if (!isMenuOpen) {
      const { offsetLeft, offsetWidth } = e.target;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  };

  const handleMouseLeave = () => {
    if (!isMenuOpen) {
      updateIndicator();
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [location]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <DynamicLogo />
        </Link>
      </div>

      <div
        className={`burger-button ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`} ref={menuRef}>
        <ul className="menu" onMouseLeave={handleMouseLeave}>
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

      <div className="api-status-container">
        {apiStatus === 'online' ? (
          <div className="api-status">
            <span className="status-circle green"></span>
            <span>En ligne</span>
          </div>
        ) : (
          <div className="api-status">
            <LogoSpinner size={20} />
            <span>Chargement...</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
