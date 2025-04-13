// src/components/GameLine.jsx
import React, { useEffect, useRef, useState } from 'react';
import './GameLine.css';

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

  // Calcule la longueur du chemin et lance l'animation du tracé
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      pathRef.current.style.strokeDasharray = len;
      pathRef.current.style.strokeDashoffset = len;
      pathRef.current.classList.add("draw-line");
    }
  }, []);

  // Génère de 1 à 3 boules toutes 1 à 6 secondes
  useEffect(() => {
    function spawnBalls() {
      const nbBalls = Math.floor(randomBetween(1, 4)); // 1 à 3 boules
      const newBalls = [];
      for (let i = 0; i < nbBalls; i++) {
        newBalls.push({
          id: Date.now() + '-' + i,
          progress: 0,
          speed: randomBetween(0.0006, 0.0055),
          radius: randomBetween(6, 12),
          color: circleColors[Math.floor(randomBetween(0, circleColors.length))]
        });
      }
      setRollingBalls(prev => [...prev, ...newBalls]);
    }

    function scheduleSpawn() {
      const nextTime = randomBetween(1000, 6000);
      return setTimeout(() => {
        spawnBalls();
        scheduleSpawn();
      }, nextTime);
    }

    const timer = scheduleSpawn();
    return () => clearTimeout(timer);
  }, []);

  // Boucle d'animation pour avancer les boules
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
   * Ici, la coordonnée Y est inversée pour correspondre à l'inversion de la courbe (via CSS).
   */
  function getXYForProgress(progress) {
    if (!pathRef.current || !svgRef.current) return { x: 0, y: 0 };

    const dist = pathLength * progress;
    const nominalPt = pathRef.current.getPointAtLength(dist);

    // Facteurs d'échelle si le SVG est étiré
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / 600;   // 600 = largeur nominale
    const scaleY = svgRect.height / 100;  // 100 = hauteur nominale

    return {
      x: svgRect.left + nominalPt.x * scaleX,
      y: svgRect.top + (svgRect.height - nominalPt.y * scaleY)  // inversion de la coordonnée Y
    };
  }

  const offsetAboveLine = 52; // Ajustez si besoin

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
