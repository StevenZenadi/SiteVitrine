import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function DynamicLogo() {
  const location = useLocation();
  const isProjects = location.pathname === '/projets';

  const circleColors = [
    "#FFAD00", // index 0 : Orange
    "#FF0000", // index 1 : Rouge
    "#828282", // index 2 : Gris
    "#00A1FF", // index 3 : Bleu
    "#1AAD0E", // index 4 : Vert
    "#894FFF"  // index 5 : Violet
  ];

  const circleRadius = 6;
  const margin = 4;
  const offset = circleRadius + margin;

  const finalPositions = [
    { x: 40, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 35 },
    { x: 40, y: 35 },
    { x: 40, y: 60 },
    { x: 10, y: 60 }
  ];

  const center = { x: 25, y: 35 };
  const factor = 1.5;

  // On enlève la propriété scale de l'animation principale.
  // On va envelopper chaque cercle dans un <motion.g> qui gère le whileHover.
  const circles = finalPositions.map((finalPos, index) => {
    const initX = -(finalPos.x - center.x) * factor;
    const initY = -(finalPos.y - center.y) * factor;
    const centerX = center.x - finalPos.x;
    const centerY = center.y - finalPos.y;
    return (
      <motion.g
        key={index}
        whileHover={{ scale: 1.2 }}
        style={{ transformOrigin: 'center', pointerEvents: 'all', cursor: 'pointer' }}
      >
        <motion.circle
          cx={finalPos.x}
          cy={finalPos.y}
          r={circleRadius}
          fill={circleColors[index]}
          initial={{ x: initX, y: initY }}
          animate={{ x: [initX, centerX, 0], y: [initY, centerY, 0] }}
          transition={{ duration: 2, times: [0, 0.5, 1], ease: "easeInOut" }}
        />
      </motion.g>
    );
  });

  let connections;
  if (location.pathname === '/jeux') {
    connections = [
      [0, 3],
      [3, 4],
      [4, 5]
    ];
  } else if (location.pathname === '/about') {
    connections = [
      [5, 2],
      [2, 1],
      [1, 0],
      [0, 3],
      [3, 4],
      [3, 2]
    ];
  } else if (location.pathname === '/contact') {
    connections = [
      [0, 1],
      [1, 2],
      [2, 5],
      [5, 4]
    ];
  } else if (location.pathname === '/projets') {
    connections = [
      [0, 1],
      [0, 3],
      [3, 2],
      [2, 1],
      [2, 5]
    ];
  } else {
    connections = [];
    for (let i = 0; i < finalPositions.length - 1; i++) {
      connections.push([i, i + 1]);
    }
  }

  const finalLines = connections.map((pair) => {
    const pos1 = finalPositions[pair[0]];
    const pos2 = finalPositions[pair[1]];
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / dist;
    const unitY = dy / dist;
    return {
      startX: pos1.x + unitX * offset,
      startY: pos1.y + unitY * offset,
      endX: pos2.x - unitX * offset,
      endY: pos2.y - unitY * offset
    };
  });

  const lines = finalLines.map((line, index) => {
    if (!line) return null;
    return (
      <motion.line
        key={`line-${index}`}
        initial={{ x1: center.x, y1: center.y, x2: center.x, y2: center.y }}
        animate={{ x1: line.startX, y1: line.startY, x2: line.endX, y2: line.endY }}
        transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
        stroke="white"
        strokeWidth={isProjects ? 3 : 2}
        strokeLinecap="round"
      />
    );
  });

  return (
    <svg
      key={location.pathname}
      width="40"
      height="56"
      viewBox="0 0 50 70"
      style={{ overflow: 'visible', pointerEvents: 'all' }}
    >
      {lines}
      {circles}
    </svg>
  );
}

export default DynamicLogo;
