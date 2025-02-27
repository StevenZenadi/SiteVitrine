// src/components/RandomCirclesBackground.jsx
import React, { useState, useEffect } from 'react';
import './RandomCirclesBackground.css';
import CirclesConnections from './CirclesConnections';

// Palette complète
const fullPalette = ["#1AAD0E", "#894FFF", "#00A1FF", "#FFAD00", "#FF0000", "#828282"];

// Fonction d'influence de couleur en fonction de la catégorie
const getColor = (selectedCategory) => {
  let favored = [];
  if (selectedCategory === "software") {
    favored = ["#00A1FF", "#894FFF"];
  } else if (selectedCategory === "hardware") {
    favored = ["#828282", "#1AAD0E"];
  } else if (selectedCategory === "apprentissage") {
    favored = ["#FF0000", "#FFAD00"];
  }
  // 70% de chance de choisir parmi les couleurs favorisées
  if (favored.length && Math.random() < 0.7) {
    return favored[Math.floor(Math.random() * favored.length)];
  } else {
    return fullPalette[Math.floor(Math.random() * fullPalette.length)];
  }
};

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const RandomCirclesBackground = ({ selectedCategory }) => {
  const [circles, setCircles] = useState([]);

  // Générer un nombre élevé de cercles, par exemple 20
  const generateCircles = () => {
    const count = 20;
    const newCircles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(getRandomNumber(40, 80)); // taille entre 40 et 80px
      const left = getRandomNumber(0, 100);  // en %
      const top = getRandomNumber(0, 100);   // en %
      const color = getColor(selectedCategory);
      const parallaxFactor = getRandomNumber(0.2, 1.0); // facteur de parallax
      newCircles.push({ id: i, size, left, top, color, parallaxFactor });
    }
    return newCircles;
  };

  useEffect(() => {
    setCircles(generateCircles());
  }, [selectedCategory]);

  // Mise à jour du parallax selon la souris
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      const offsetX = (e.clientX - window.innerWidth / 2) / 100;
      const offsetY = (e.clientY - window.innerHeight / 2) / 100;
      setMouseOffset({ x: offsetX, y: offsetY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="random-circles-background">
      {circles.map(circle => (
        <div
          key={circle.id}
          className="circle"
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            backgroundColor: circle.color,
            left: `${circle.left}%`,
            top: `${circle.top}%`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: `translate(${mouseOffset.x * circle.parallaxFactor}px, ${mouseOffset.y * circle.parallaxFactor}px)`
          }}
        />
      ))}
      <CirclesConnections circles={circles} ballSize={50} />
    </div>
  );
};

export default RandomCirclesBackground;
