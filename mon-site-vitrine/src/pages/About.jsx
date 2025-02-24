// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import "./About.css";
import profil from '../images/profilTransparent.webp'; // Utilisez la même image ou une autre si vous préférez

function About() {
  // On utilise un offset pour l'effet parallax vertical
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * 0.3); // Ajustez le coefficient selon vos préférences
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="about-page">
      <div className="hero-container">
        {/* Image de profil en premier plan */}
        <img 
          src={profil} 
          alt="Profil" 
          className="hero-image" 
          loading="lazy"
          style={{ transform: `translateY(${offset}px) scale(1.1)` }}
        />
        <div className="hero-overlay"></div>
        {/* Texte placé en haut à gauche */}
        <div className="hero-text top-left">
          <h1>À Propos de Moi</h1>
        </div>
        {/* Texte placé en bas à droite */}
        <div className="hero-text bottom-right">
          <p>Découvrez mon parcours, mes compétences et mes passions.</p>
        </div>
      </div>
      
      <div className="about-content">
        {/* Votre contenu pour la page À propos */}
        <p>Ici, vous pouvez ajouter une description plus détaillée de votre parcours, vos valeurs, etc.</p>
      </div>
    </div>
  );
}

export default About;
