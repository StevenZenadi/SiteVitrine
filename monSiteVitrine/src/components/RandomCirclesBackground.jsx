// src/components/RandomCirclesBackground.jsx
import React, { useState, useEffect } from 'react';
import './RandomCirclesBackground.css';

const fullPalette = ["#1AAD0E", "#894FFF", "#00A1FF", "#FFAD00", "#FF0000", "#828282"];

const getColor = (selectedCategory) => {
  let favored = [];
  if (selectedCategory === "software") {
    favored = ["#00A1FF", "#894FFF"];
  } else if (selectedCategory === "hardware") {
    favored = ["#828282", "#1AAD0E"];
  } else if (selectedCategory === "apprentissage") {
    favored = ["#FF0000", "#FFAD00"];
  }
  if (favored.length && Math.random() < 0.7) {
    return favored[Math.floor(Math.random() * favored.length)];
  } else {
    return fullPalette[Math.floor(Math.random() * fullPalette.length)];
  }
};

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
};

const RandomCirclesBackground = ({ selectedCategory }) => {
  const [circles, setCircles] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Augmenter la densité : par exemple, générer 20 cercles au lieu de 10.
  const generateCircles = () => {
    const count = 20;
    const newCircles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(getRandomNumber(20, 100));
      const left = getRandomNumber(0, 100);
      const top = getRandomNumber(0, 100);
      const color = getColor(selectedCategory);
      // Plus la boule est grande, plus elle bouge (parallaxFactor élevé)
      const parallaxFactor = mapRange(size, 20, 100, 0.2, 1);
      // Les plus petites sont plus floues
      const blur = mapRange(size, 20, 100, 5, 1);
      // Z-index en fonction de la taille : les grandes cercles sont devant
      const zIndex = Math.floor(size);
      newCircles.push({ id: i, size, left, top, color, parallaxFactor, blur, zIndex });
    }
    return newCircles;
  };

  // Génération initiale
  useEffect(() => {
    setCircles(generateCircles());
  }, []);

  // Transition lors du changement de catégorie
  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setCircles(generateCircles());
      setTransitioning(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Mise à jour du parallax via le mouvement de la souris
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
          className={`circle ${transitioning ? 'fade-out' : 'fade-in'}`}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            backgroundColor: circle.color,
            left: `${circle.left}%`,
            top: `${circle.top}%`,
            filter: `blur(${circle.blur}px)`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: `translate(${mouseOffset.x * circle.parallaxFactor}px, ${mouseOffset.y * circle.parallaxFactor}px)`,
            zIndex: circle.zIndex
          }}
        />
      ))}
      {/* Les lignes de connexion ont été retirées */}
    </div>
  );
};

export default RandomCirclesBackground;
