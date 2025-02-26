import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../images/Logo.png';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul className="menu">
          <li><Link to="/" className="menu-link">Accueil</Link></li>
          <li><Link to="/projets" className="menu-link">Projets</Link></li>
          <li><Link to="/jeux" className="menu-link">Jeux</Link></li>
          <li><Link to="/about" className="menu-link">À propos</Link></li>
          <li><Link to="/contact" className="menu-link">Contact</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        {/* Autres éléments du header, comme le bouton accessibilité */}
      </div>
    </header>
  );
}

export default Header;
