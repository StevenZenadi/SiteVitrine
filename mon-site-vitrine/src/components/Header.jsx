// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LogoTilt from './LogoTilt';
import './Header.css';
import Logo from "../images/Logo.webp"

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <LogoTilt src={Logo} alt="Logo" />
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
    </header>
  );
}

export default Header;
