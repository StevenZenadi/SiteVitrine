// src/components/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectCategory } from '../contexts/ProjectCategoryContext';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {

  return (
    <footer
      className="footer"
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
        </div>
        <p className="footer-copy">
          © 2025 Mon Site - Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

export default Footer;
