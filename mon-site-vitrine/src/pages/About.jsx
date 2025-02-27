// src/pages/About.jsx
import React, { useState, useEffect, useRef } from 'react';
import './About.css';
import WordIm from '../components/WordIm';
import img1 from '../images/orange.png';
import img2 from '../images/rouge.png';
import img3 from '../images/gris.png';
import img4 from '../images/bleu.png';
import img5 from '../images/vert.png';
import img6 from '../images/violet.png';

const images = [img1, img2, img3, img4, img5, img6];
// Texte associé à chaque boule (par exemple, lettres de "STEVEN")
const texts = ["S", "T", "E", "V", "E", "N"];

function ParallaxBackground() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  // bouncingIndex indique l'indice de la boule en animation
  const [bouncingIndex, setBouncingIndex] = useState(null);
  const [idle, setIdle] = useState(false);
  const lastMouseMoveRef = useRef(Date.now());

  // Paramètres de mise en page
  const ballSize = 80; // diamètre en pixels
  const spacing = 70;  // espacement horizontal entre les boules
  const nbBalls = images.length;
  const totalWidth = (nbBalls - 1) * spacing + ballSize;

  // Mise à jour du parallax via le mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      const offsetX = (e.clientX - window.innerWidth / 2) / 40;
      const offsetY = (e.clientY - window.innerHeight / 2) / 40;
      setMouseOffset({ x: offsetX, y: offsetY });
      lastMouseMoveRef.current = Date.now();
      setIdle(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Détecter l'inactivité de la souris (2 secondes)
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastMouseMoveRef.current > 2000) {
        setIdle(true);
      } else {
        setIdle(false);
      }
    }, 500);
    return () => clearInterval(checkIdle);
  }, []);

  // Déclencher aléatoirement l'animation sur une seule boule quand idle est vrai
  useEffect(() => {
    if (!idle) {
      setBouncingIndex(null);
      return;
    }
    const bounceInterval = setInterval(() => {
      if (bouncingIndex === null) {
        const randomIndex = Math.floor(Math.random() * nbBalls);
        setBouncingIndex(randomIndex);
        setTimeout(() => {
          setBouncingIndex(null);
        }, 2000);
      }
    }, 4000);
    return () => clearInterval(bounceInterval);
  }, [idle, bouncingIndex, nbBalls]);

  return (
    <div className="parallax-container">
      <div
        className="parallax-row"
        style={{
          width: `${totalWidth}px`,
          top: '120px',       // Ajustez la distance du haut
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {images.map((img, index) => {
          const left = index * spacing;
          const top = (index % 2 === 0) ? 0 : 40;  // Alternance de hauteur
          const factor = 1;
          const isBouncing = bouncingIndex === index;

          // Pour la boule : si elle est en animation, appliquer une animation atténuée (ballEyeMovement)
          const ballStyle = isBouncing
            ? {
              width: `${ballSize}px`,
              height: `${ballSize}px`,
              left: `${left}px`,
              top: `${top}px`,
              backgroundImage: `url(${img})`,
              zIndex: (index % 2 === 0) ? 1 : 2,
              '--initial-x': `${mouseOffset.x}px`,
              '--initial-y': `${mouseOffset.y}px`,
              animation: `ballEyeMovement 2s ease-out`
            }
            : {
              width: `${ballSize}px`,
              height: `${ballSize}px`,
              left: `${left}px`,
              top: `${top}px`,
              backgroundImage: `url(${img})`,
              zIndex: (index % 2 === 0) ? 1 : 2,
              transform: `translate(${mouseOffset.x * factor}px, ${mouseOffset.y * factor}px)`
            };

          // Pour le texte : si la boule est en animation, appliquer l'animation "eyeMovement" complète
          const textStyle = isBouncing
            ? {
              '--initial-x': `${mouseOffset.x}px`,
              '--initial-y': `${mouseOffset.y}px`,
              animation: `eyeMovement 2s ease-out`
            }
            : { transform: `translate(${mouseOffset.x * factor}px, ${mouseOffset.y * factor}px)` };

          return (
            <div
              key={index}
              className="parallax-ball"
              style={ballStyle}
            >
              <div className="ball-text" style={textStyle}>
                {texts[index]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="about-page">
      <ParallaxBackground />
      {/* Intégration du mot "I'm" sous les boules */}
      <WordIm />
      <div className="about-content">
        <h1>À Propos de Moi</h1>
        <p>Votre contenu ici…</p>
      </div>
    </div>
  );
}

export default About;
