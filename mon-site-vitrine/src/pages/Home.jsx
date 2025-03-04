// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import LogoAnimated from '../components/LogoAnimated';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

function Home() {
  return (
    <div className="home-page">
      {/* Section Hero */}
      <section className="hero-container">
        <div className="hero-content">
          <LogoAnimated />
          <h1 className="hero-title">Bienvenue sur mon portfolio</h1>
          <p className="hero-subtitle">Développeur Web & IoT Passionné</p>
        </div>
      </section>

      {/* Section Aperçu des Projets */}
      <section className="projects-preview">
        <h2>Projets récents</h2>
        <div className="projects-grid">
          <div className="project-card">
            <img src="/images/project1.jpg" alt="Projet 1" />
            <h3>Projet 1</h3>
            <p>Création d’un site vitrine moderne et responsive.</p>
          </div>
          <div className="project-card">
            <img src="/images/project2.jpg" alt="Projet 2" />
            <h3>Projet 2</h3>
            <p>Système IoT pour la domotique et l’automatisation.</p>
          </div>
          <div className="project-card">
            <img src="/images/project3.jpg" alt="Projet 3" />
            <h3>Projet 3</h3>
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



