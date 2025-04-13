// src/components/LogoTilt.jsx
import React, { useRef } from 'react';
import './LogoTilt.css';

function LogoTilt({ src, alt }) {
  const logoRef = useRef(null);

  const handleMouseMove = (e) => {
    const element = logoRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    // Augmentation des valeurs pour un effet plus prononcé
    element.style.transform = `perspective(1000px) rotateX(${deltaY * 40}deg) rotateY(${deltaX * -40}deg) scale(1.3)`;
  };
  
  const handleMouseLeave = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };
  

  return (
    <div 
      ref={logoRef}
      className="logo-tilt"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={src} alt={alt} />
    </div>
  );
}

export default LogoTilt;
