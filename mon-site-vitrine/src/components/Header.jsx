// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul className="menu">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/projects">Projets</Link></li>
          <li><Link to="/skills">Compétences</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
