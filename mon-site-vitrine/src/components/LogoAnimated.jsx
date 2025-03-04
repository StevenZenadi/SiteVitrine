import React, { useState, useEffect, useRef } from 'react';
import './LogoAnimated.css';
import WordIm from './WordIm';
import img1 from '../images/orange.png';
import img2 from '../images/rouge.png';
import img3 from '../images/gris.png';
import img4 from '../images/bleu.png';
import img5 from '../images/vert.png';
import img6 from '../images/violet.png';

const images = [img1, img2, img3, img4, img5, img6];
const texts = ["S", "T", "E", "V", "E", "N"];

function LogoAnimated() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [bouncingIndex, setBouncingIndex] = useState(null);
  const [idle, setIdle] = useState(false);
  const lastMouseMoveRef = useRef(Date.now());
  
  const ballSize = 80;
  const spacing = 70;
  const nbBalls = images.length;
  const totalWidth = (nbBalls - 1) * spacing + ballSize;
  
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
    <div className="logo-animated-container">
      <div 
        className="parallax-row"
        style={{
          width: `${totalWidth}px`,
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {images.map((img, index) => {
          const left = index * spacing;
          const top = (index % 2 === 0) ? 0 : 40;
          const factor = 1;
          const isBouncing = bouncingIndex === index;
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
          const textStyle = isBouncing
            ? {
                '--initial-x': `${mouseOffset.x}px`,
                '--initial-y': `${mouseOffset.y}px`,
                animation: `eyeMovement 2s ease-out`
              }
            : { transform: `translate(${mouseOffset.x * factor}px, ${mouseOffset.y * factor}px)` };
          
          return (
            <div key={index} className="parallax-ball" style={ballStyle}>
              <div className="ball-text" style={textStyle}>
                {texts[index]}
              </div>
            </div>
          );
        })}
      </div>
      {/* Intégration du composant WordIm sous les boules pour compléter le logo */}
      <WordIm />
    </div>
  );
}

export default LogoAnimated;
