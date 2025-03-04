import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function DynamicLogo() {
  const location = useLocation();

  // Couleurs dans l'ordre souhaité
  const circleColors = [
    "#FFAD00",
    "#FF0000",
    "#828282",
    "#00A1FF",
    "#894FFF",
    "#1AAD0E"
  ];

  const circleRadius = 6;
  const margin = 4; // Espace entre le bord du cercle et l'extrémité de la ligne
  const offset = circleRadius + margin; // Décalage pour les lignes

  const positions = useMemo(() => {
    switch (location.pathname) {
      case '/projets':
        return [
          { x: 20,  y: 50 },
          { x: 60,  y: 50 },
          { x: 100, y: 50 },
          { x: 140, y: 50 },
          { x: 180, y: 50 },
          { x: 220, y: 50 },
        ];
      case '/jeux':
        return [
          { x: 50, y: 10 },
          { x: 50, y: 40 },
          { x: 50, y: 70 },
          { x: 50, y: 100 },
          { x: 50, y: 130 },
          { x: 50, y: 160 },
        ];
      case '/about':
        return [
          { x: 100, y: 30 },
          { x: 140, y: 60 },
          { x: 140, y: 110 },
          { x: 100, y: 140 },
          { x: 60,  y: 110 },
          { x: 60,  y: 60  },
        ];
      default:
        // Disposition de la page d'accueil :
        // 0 : "#828282" (droite, en haut)
        // 1 : "#FF0000" (gauche, en haut)
        // 2 : "#FFAD00" (sous le rouge)
        // 3 : "#00A1FF" (sous l’orange)
        // 4 : "#894FFF" (sous le bleu)
        // 5 : "#1AAD0E" (sous le gris)
        return [
          { x: 40, y: 10 },  // Index 0 : droite en haut
          { x: 10, y: 10 },  // Index 1 : gauche en haut
          { x: 10, y: 35 },  // Index 2 : sous le rouge
          { x: 40, y: 35 },  // Index 3 : sous l’orange
          { x: 40, y: 60 },  // Index 4 : sous le bleu
          { x: 10, y: 60 },  // Index 5 : sous le gris
        ];
    }
  }, [location.pathname]);

  // Création des cercles
  const circles = positions.map((pos, index) => (
    <circle
      key={index}
      cx={pos.x}
      cy={pos.y}
      r={circleRadius}
      fill={circleColors[index]}
    />
  ));

  // Création des lignes reliant les cercles, en laissant un espace aux extrémités
  const lines = positions.map((pos, index) => {
    if (index === positions.length - 1) return null;
    const nextPos = positions[index + 1];
    const dx = nextPos.x - pos.x;
    const dy = nextPos.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;
    const unitX = dx / dist;
    const unitY = dy / dist;
    const startX = pos.x + unitX * offset;
    const startY = pos.y + unitY * offset;
    const endX = nextPos.x - unitX * offset;
    const endY = nextPos.y - unitY * offset;
    return (
      <line
        key={`line-${index}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />
    );
  });

  // Réduction de la taille globale du logo : dimensions du SVG réduites
  return (
    <svg
      width="40"
      height="56"
      viewBox="0 0 50 70"
      style={{ overflow: 'visible' }}
    >
      {lines}
      {circles}
    </svg>
  );
}

export default DynamicLogo;
