// src/components/SeparatorLine.jsx
import React, { useEffect, useRef } from 'react';
import './SeparatorLine.css';

const SeparatorLine = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    // Configurez le path pour l'animation de "dessin"
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    // Forcer le recalcul
    path.getBoundingClientRect();
    // Appliquer la transition pour animer le dashoffset sur 2 secondes
    path.style.transition = 'stroke-dashoffset 2s ease-in-out';
    // Démarrer l'animation
    path.style.strokeDashoffset = '0';
  }, []);

  return (
    <svg className="separator-line" viewBox="0 0 1000 50" preserveAspectRatio="none">
      <path 
        ref={pathRef}
        d="M0,25 C250,0 750,50 1000,25" 
        stroke="black" 
        strokeWidth="4" 
        fill="none" 
      />
    </svg>
  );
};

export default SeparatorLine;
