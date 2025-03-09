// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import LogoAnimated from '../components/LogoAnimated';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import miniature1 from "../images/miniature1.png";
import miniature2 from "../images/miniature2.png";
import miniatureSnake from "../videos/miniatureSnake.mp4";

function Home() {
  return (
    <div className="home-page">
      {/* Section Hero */}
      <section className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue sur mon portfolio </h1>
          <LogoAnimated />

          <p className="hero-subtitle">Développeur Web & IoT Passionné</p>
          <p className="hero-subtitle">
            Cette application React a pour but de vous présenter mon savoir-faire et de vous permettre de mieux me connaître. 
          </p>
        </div>
      </section>

      {/* Section Aperçu des Projets */}
      <section className="projects-preview">
        <h2>Projets récents</h2>
        <div className="projects-grid">
          <div className="project-card">
            <img src={miniature1} alt="Projet 1" />
            <h3>Portfolio</h3>
            <p>Création d’un portfolio moderne et responsive.</p>
          </div>
          <div className="project-card">
            <h3>Coming Soon</h3>
            <p>Site commercial pour un auto-entrepreneur informatique.</p>
          </div>
          <div className="project-card">
            <video
              className="game-thumbnail"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={miniatureSnake} type="video/mp4" />
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
            <h3>Jeux Snake</h3>
            <p>Prototype interactif d’un jeu Snake amélioré.</p>
          </div>
        </div>
        <Link to="/projets" className="more-projects">
          Voir tous les projets
        </Link>
      </section>

      {/* Section Témoignages */}
      <section className="testimonials-section">
        <h2>Ce qu'ils disent de moi</h2>
        <TestimonialsCarousel />
      </section>

      <section className="contact-cta">
        <h2>Vous avez un projet en tête ?</h2>
        <p>
          N'hésitez pas à me contacter pour discuter de vos idées et voir comment je peux vous aider.
        </p>
        <Link to="/contact" className="btn-contact">
          Contactez-moi
        </Link>
      </section>
    </div>
  );
}

export default Home;



