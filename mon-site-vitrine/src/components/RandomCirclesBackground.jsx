// src/components/RandomCirclesBackground.jsx
import React, { useState, useEffect } from 'react';
import './RandomCirclesBackground.css';
import CirclesConnections from './CirclesConnections';

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

const RandomCirclesBackground = ({ selectedCategory }) => {
  const [circles, setCircles] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Génération des cercles (diminution de la densité : par exemple 10 cercles)
  const generateCircles = () => {
    const count = 10;
    const newCircles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(getRandomNumber(40, 80));
      const left = getRandomNumber(0, 100);
      const top = getRandomNumber(0, 100);
      const color = getColor(selectedCategory);
      const parallaxFactor = getRandomNumber(0.2, 1.0);
      newCircles.push({ id: i, size, left, top, color, parallaxFactor });
    }
    return newCircles;
  };

  // Génération initiale des cercles
  useEffect(() => {
    setCircles(generateCircles());
  }, []);

  // Lorsque la catégorie change, on déclenche une transition : fade-out puis fade-in
  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setCircles(generateCircles());
      setTransitioning(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Mise à jour du parallax via la souris
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
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: `translate(${mouseOffset.x * circle.parallaxFactor}px, ${mouseOffset.y * circle.parallaxFactor}px)`
          }}
        />
      ))}
      <CirclesConnections circles={circles} ballSize={50} transitioning={transitioning} />
    </div>
  );
};

export default RandomCirclesBackground;
