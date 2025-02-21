// Exemple dans un composant HeroBackground.jsx
import React from 'react';
import useParallax from '../hooks/useParallax';
import mainImage from '../images/home2.webp';
import profil from '../images/profil.webp';

import './Background.css';

function HeroBackground() {
  const offsetY = useParallax(0.3);

  return (
    <div className="hero-background" style={{ transform: `translateY(${offsetY}px)` }}>
      <img src={profil} alt="Background" className="hero-bg-image" loading="lazy" />
    </div>
  );
}

export default HeroBackground;
