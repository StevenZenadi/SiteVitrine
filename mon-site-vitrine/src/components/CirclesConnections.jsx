import React, { useState, useEffect } from 'react';

const CirclesConnections = ({ circles, ballSize }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Définir le nombre de connexions (par exemple, la moitié du nombre de cercles)
    const numConnections = Math.floor(circles.length / 2);
    const connections = [];
    const usedPairs = new Set();

    while (connections.length < numConnections) {
      const i = Math.floor(Math.random() * circles.length);
      const j = Math.floor(Math.random() * circles.length);
      if (i !== j) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!usedPairs.has(key)) {
          usedPairs.add(key);
          connections.push({ i, j });
        }
      }
    }

    // Calculer les positions en pixels pour chaque connexion.
    const width = window.innerWidth;
    const height = window.innerHeight;
    const computedLines = connections.map((conn, index) => {
      const circle1 = circles[conn.i];
      const circle2 = circles[conn.j];
      const cx1 = (circle1.left / 100) * width + ballSize / 2;
      const cy1 = (circle1.top / 100) * height + ballSize / 2;
      const cx2 = (circle2.left / 100) * width + ballSize / 2;
      const cy2 = (circle2.top / 100) * height + ballSize / 2;
      const dx = cx2 - cx1;
      const dy = cy2 - cy1;
      const angle = Math.atan2(dy, dx);
      const offset = ballSize / 2 + 5; // marge de 5px
      const startX = cx1 + Math.cos(angle) * offset;
      const startY = cy1 + Math.sin(angle) * offset;
      const endX = cx2 - Math.cos(angle) * offset;
      const endY = cy2 - Math.sin(angle) * offset;
      return { startX, startY, endX, endY, key: index };
    });

    setLines(computedLines);
  }, [circles, ballSize]); // Se recalculera uniquement quand circles ou ballSize changent

  return (
    <svg
      className="connections-svg"
      width="100%"
      height="100%"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {lines.map((line) => (
        <line
          key={line.key}
          x1={line.startX}
          y1={line.startY}
          x2={line.endX}
          y2={line.endY}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="1"
          filter="url(#blurFilter)"
        />
      ))}
      <defs>
        <filter id="blurFilter">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
    </svg>
  );
};

export default CirclesConnections;
