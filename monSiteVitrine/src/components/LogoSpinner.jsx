// src/components/CarRaceSpinner.jsx
import React from 'react';
import './LogoSpinner.css';

const circleColors = [
  '#FFAD00', // Orange
  '#FF0000', // Rouge
  '#828282', // Gris
  '#00A1FF', // Bleu
  '#1AAD0E', // Vert
  '#894FFF'  // Violet
];

function CarRaceSpinner({ size = 80 }) {
  // Calcul proportionnel pour la taille des boules et le rayon
  const ballSize = size * 0.15;   // 15% de la taille totale
  const radius   = size * 0.4;    // 40% de la taille totale

  return (
    <div
      className="car-race-spinner-container"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        '--ball-size': `${ballSize}px`,
        '--radius': `${radius}px`
      }}
    >
      {circleColors.map((color, i) => {
        const angle = i * (360 / circleColors.length);
        const delay = `${i * 0.3}s`;
        return (
          <div
            key={color}
            className="car-race-ball"
            style={{
              '--angle': `${angle}deg`,
              '--color': color,
              '--delay': delay
            }}
          />
        );
      })}
    </div>
  );
}

export default CarRaceSpinner;
