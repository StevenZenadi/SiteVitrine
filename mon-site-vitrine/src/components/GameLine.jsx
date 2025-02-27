// src/components/GameLine.jsx
import React, { useEffect, useRef, useState } from 'react';
import './GameLine.css';

// Palette de couleurs pour les boules
const circleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#894FFF", "#1AAD0E"];

/** Génère un nombre aléatoire dans [min, max]. */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function GameLine() {
  const pathRef = useRef(null);
  const svgRef = useRef(null);

  const [pathLength, setPathLength] = useState(600);
  const [rollingBalls, setRollingBalls] = useState([]);

  // Calcule la longueur géométrique du chemin, pour animer le tracé et positionner les boules.
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);

      // On applique strokeDasharray/strokeDashoffset en inline
      pathRef.current.style.strokeDasharray = len;
      pathRef.current.style.strokeDashoffset = len;

      // On ajoute la classe pour déclencher l'animation
      pathRef.current.classList.add("draw-line");
    }
  }, []);

  // Lance un cycle de génération de boules (1..3 boules) toutes 1..6 secondes
  useEffect(() => {
    function spawnBalls() {
      const nbBalls = Math.floor(randomBetween(1, 4)); // 1 à 3 boules
      const newBalls = [];
      for (let i = 0; i < nbBalls; i++) {
        newBalls.push({
          id: Date.now() + '-' + i,
          progress: 0,
          speed: randomBetween(0.0006, 0.0055),
          radius: randomBetween(6, 12), // petite taille
          color: circleColors[Math.floor(randomBetween(0, circleColors.length))]
        });
      }
      setRollingBalls(prev => [...prev, ...newBalls]);
    }

    function scheduleSpawn() {
      const nextTime = randomBetween(1000, 6000); // 1..6 secondes
      return setTimeout(() => {
        spawnBalls();
        scheduleSpawn();
      }, nextTime);
    }

    const timer = scheduleSpawn();
    return () => clearTimeout(timer);
  }, []);

  // Boucle requestAnimationFrame pour avancer les boules
  useEffect(() => {
    let rafId;

    function update() {
      setRollingBalls(prev => {
        const newBalls = [];
        for (let b of prev) {
          const newProg = b.progress + b.speed;
          if (newProg < 1) {
            newBalls.push({ ...b, progress: newProg });
          }
          // sinon, la boule quitte l'écran
        }
        return newBalls;
      });
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /**
   * Calcule la position (x,y) d'une boule à un "progress" (0..1) sur le chemin.
   * On récupère le point nominal via getPointAtLength,
   * puis on scale selon la taille réelle (si le SVG est stretché).
   */
  function getXYForProgress(progress) {
    if (!pathRef.current || !svgRef.current) return { x: 0, y: 0 };

    const dist = pathLength * progress;
    const nominalPt = pathRef.current.getPointAtLength(dist);

    // Facteurs d'échelle si le SVG est stretché en largeur
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / 600;   // 600 = largeur nominale
    const scaleY = svgRect.height / 100;  // 100 = hauteur nominale dans ce path

    return {
      x: svgRect.left + nominalPt.x * scaleX,
      y: svgRect.top + nominalPt.y * scaleY
    };
  }
  const offsetAboveLine = 52; // Ajustez selon la hauteur à laquelle vous voulez placer la boule au-dessus

  return (
    <div className="game-line-container">
      <svg
        ref={svgRef}
        className="game-line-svg"
        width="100%"
        height="100px"             
        viewBox="0 0 600 100"       
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className="line-serp animate-line"
          d={`
            M 0,50
            C 200,20 400,80 600,50
          `}
        />
      </svg>

      {rollingBalls.map((b) => {
        const { x, y } = getXYForProgress(b.progress);
        return (
          <div
          key={b.id}
          className="rolling-ball"
          style={{
            width: `${b.radius * 2}px`,
            height: `${b.radius * 2}px`,
            backgroundColor: b.color,
            left: `${x - b.radius}px`,
            top: `${y - (b.radius * 2 + offsetAboveLine)}px`
            }}
          />
        );
      })}
    </div>
  );
}

export default GameLine;
