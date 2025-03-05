import React, { useRef, useEffect, useState } from 'react';
import './SnakeGame.css';

const tickDuration = 100;      // Durée d'un tick en ms
const gridSize = 20;           // Taille d'une cellule
const countdownLimit = 5000;   // Temps imparti pour manger un groupe de pommes

// Interpolation linéaire
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Convertir un hex en rgba (pour la bordure flash)
function hexToRgba(hex, alpha) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Fonction utilitaire pour dessiner un rectangle avec des coins arrondis
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Définition des effets et couleurs associés (7 bonus)
const appleEffects = [
  { color: "#828282", effect: "extensionTemps", label: "EXT", probability: 0.20 },
  { color: "#FF0000", effect: "boostScore", label: "BOOST", probability: 0.20 },
  { color: "#00A1FF", effect: "freeze", label: "FREEZE", probability: 0.10 },
  { color: "#894FFF", effect: "segmentsSupp", label: "SEG+", probability: 0.10 },
  { color: "#FFFFFF", effect: "passThrough", label: "PASS", probability: 0.20 },
  { color: "#FFAD00", effect: "magnet", label: "MAG", probability: 0.10 },
  { color: "#1AAD0E", effect: "slow", label: "SLOW", probability: 0.10 }
];

function pickAppleEffect() {
  const r = Math.random();
  let sum = 0;
  for (let effect of appleEffects) {
    sum += effect.probability;
    if (r < sum) return effect;
  }
  return appleEffects[0];
}

const placeSingleApple = (obstacles, canvasWidth, canvasHeight, existingPositions = []) => {
  const cols = canvasWidth / gridSize;
  const rows = canvasHeight / gridSize;
  let tries = 0;
  const maxTries = 100;
  while (tries < maxTries) {
    const x = Math.floor(Math.random() * cols) * gridSize;
    const y = Math.floor(Math.random() * rows) * gridSize;
    let collides = obstacles.some(obs =>
      x < obs.x + obs.width &&
      x + gridSize > obs.x &&
      y < obs.y + obs.height &&
      y + gridSize > obs.y
    );
    collides = collides || existingPositions.some(pos => pos.x === x && pos.y === y);
    if (!collides) {
      const effect = pickAppleEffect();
      return { x, y, color: effect.color, effect: effect.effect, label: effect.label };
    }
    tries++;
  }
  const effect = pickAppleEffect();
  return { x: 0, y: 0, color: effect.color, effect: effect.effect, label: effect.label };
};

const generateAppleGroup = (groupCount, obstacles, canvasWidth, canvasHeight) => {
  const apples = [];
  for (let i = 0; i < groupCount; i++) {
    const apple = placeSingleApple(obstacles, canvasWidth, canvasHeight, apples);
    apples.push(apple);
  }
  return apples;
};

const generateObstacles = (level, canvasWidth, canvasHeight) => {
  const obstacles = [];
  const count = Math.min(3 + level - 1, 8);
  for (let i = 0; i < count; i++) {
    const obstacleWidth = gridSize * (2 + Math.floor(Math.random() * 2));
    const obstacleHeight = gridSize * (2 + Math.floor(Math.random() * 2));
    const maxX = Math.floor((canvasWidth - obstacleWidth) / gridSize);
    const maxY = Math.floor((canvasHeight - obstacleHeight) / gridSize);
    obstacles.push({
      x: Math.floor(Math.random() * maxX) * gridSize,
      y: Math.floor(Math.random() * maxY) * gridSize,
      width: obstacleWidth,
      height: obstacleHeight,
    });
  }
  return obstacles;
};

const generateObstaclesAvoiding = (level, canvasWidth, canvasHeight, avoidPositions) => {
  const obstacles = [];
  const count = Math.min(3 + level - 1, 8);
  let attempts = 0;
  while (obstacles.length < count && attempts < 50 * count) {
    attempts++;
    const obstacleWidth = gridSize * (2 + Math.floor(Math.random() * 2));
    const obstacleHeight = gridSize * (2 + Math.floor(Math.random() * 2));
    const maxX = Math.floor((canvasWidth - obstacleWidth) / gridSize);
    const maxY = Math.floor((canvasHeight - obstacleHeight) / gridSize);
    const x = Math.floor(Math.random() * maxX) * gridSize;
    const y = Math.floor(Math.random() * maxY) * gridSize;
    const candidate = { x, y, width: obstacleWidth, height: obstacleHeight };
    const collides = avoidPositions.some(pos =>
      pos.x >= candidate.x && pos.x < candidate.x + candidate.width &&
      pos.y >= candidate.y && pos.y < candidate.y + candidate.height
    );
    if (!collides) obstacles.push(candidate);
  }
  return obstacles;
};

const initialSnake = [
  { x: 40, y: 40 },
  { x: 20, y: 40 },
  { x: 0, y: 40 },
];
const initialDirection = { x: gridSize, y: 0 };

const effectDurations = {
  extensionTemps: 3000,
  boostScore: 3000,
  passThrough: 5000,
  freeze: 4000,
  segmentsSupp: 4000,
  magnet: 3000,
  slow: 3000
};

function bonusColor(type) {
  switch (type) {
    case "passThrough": return "multicolor"; // mode multicolore pour le serpent
    case "freeze": return "#00A1FF"; // Bleu pour freeze
    case "boostScore": return "#FF0000"; // Rouge
    case "extensionTemps": return "#828282"; // Gris
    case "segmentsSupp": return "#894FFF"; // Violet
    case "magnet": return "#FFAD00"; // Orange
    case "slow": return "#1AAD0E"; // Vert
    default: return "green";
  }
}

function getSnakeAppearance(activeBonuses) {
  if (activeBonuses.length === 0) return { base: "green", secondary: null };
  const sorted = activeBonuses.slice().sort((a, b) => a.appliedAt - b.appliedAt);
  const base = bonusColor(sorted[0].type);
  const secondary = sorted.length >= 2 ? bonusColor(sorted[1].type) : null;
  return { base, secondary };
}

// Hook pour les contrôles par swipe
const useSwipeControls = (setDirection) => {
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20) {
        setDirection({ x: gridSize, y: 0 });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (dx < -20) {
        setDirection({ x: -gridSize, y: 0 });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    } else {
      if (dy > 20) {
        setDirection({ x: 0, y: gridSize });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (dy < -20) {
        setDirection({ x: 0, y: -gridSize });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};

const SnakeGame = ({ onQuit }) => {
  // Références et états
  const canvasRef = useRef(null);
  const accumulatorRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const startTimeRef = useRef(0);
  const groupSpawnTimeRef = useRef(0);
  const diagonalCounterRef = useRef(0);
  const pressedKeysRef = useRef(new Set());
  const animationFrameIdRef = useRef(null);

  const renderedSnakeRef = useRef([]);
  const maxTrailFrames = 30;
  const pointEffectsRef = useRef([]);
  const applesEatenRef = useRef(0);

  const [activeBonuses, setActiveBonuses] = useState([]);
  const activeBonusesRef = useRef([]);

  // State pour le flash de bordure
  const [borderFlash, setBorderFlash] = useState(null);

  const [chrono, setChrono] = useState(0);
  const [countdown, setCountdown] = useState((countdownLimit / 1000).toFixed(1));
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [comboCount, setComboCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const appleGroupCount = 3;

  const [direction, setDirection] = useState(initialDirection);
  useEffect(() => {
    gameStateRef.current.direction = direction;
  }, [direction]);

  const gameStateRef = useRef({
    snake: initialSnake.map(s => ({ ...s })),
    direction: initialDirection,
    obstacles: generateObstacles(level, canvasWidth, canvasHeight),
    apples: generateAppleGroup(appleGroupCount, [], canvasWidth, canvasHeight),
    canvasWidth,
    canvasHeight,
    gameOver: false,
    groupFrozen: false,
  });

  const previousStateRef = useRef({
    snake: initialSnake.map(s => ({ ...s })),
  });

  const addBonus = (bonus) => {
    bonus.appliedAt = performance.now();
    activeBonusesRef.current.push(bonus);
    setActiveBonuses([...activeBonusesRef.current]);
  };

  const updateBonuses = (timestamp) => {
    activeBonusesRef.current = activeBonusesRef.current.filter(b => b.expires > timestamp);
    setActiveBonuses([...activeBonusesRef.current]);
  };

  const applyBonus = (effect, timestamp) => {
    let bonus = null;
    switch (effect) {
      case "extensionTemps":
        bonus = { type: "extensionTemps", expires: timestamp + effectDurations.extensionTemps };
        break;
      case "boostScore":
        bonus = { type: "boostScore", expires: timestamp + effectDurations.boostScore };
        break;
      case "segmentsSupp":
        bonus = { type: "segmentsSupp", expires: timestamp + effectDurations.segmentsSupp };
        {
          const tail = gameStateRef.current.snake[gameStateRef.current.snake.length - 1];
          gameStateRef.current.snake.push({ ...tail }, { ...tail });
        }
        break;
      case "passThrough":
        bonus = { type: "passThrough", expires: timestamp + effectDurations.passThrough };
        break;
      case "freeze":
        bonus = { type: "freeze", expires: timestamp + effectDurations.freeze };
        break;
      case "magnet":
        bonus = { type: "magnet", expires: timestamp + effectDurations.magnet };
        break;
      case "slow":
        bonus = { type: "slow", expires: timestamp + effectDurations.slow };
        break;
      default:
        break;
    }
    if (bonus) {
      addBonus(bonus);
      const flashColor = (effect === "passThrough") ? "#FFFFFF" : bonusColor(effect);
      setBorderFlash({ color: flashColor, expires: timestamp + 1000 });
    }
  };

  // Contrôles par swipe pour mobile
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeControls(setDirection);

  useEffect(() => {
    const handleKeyDown = e => {
      const key = e.key.toLowerCase();
      if (["z", "q", "s", "d"].includes(key)) {
        pressedKeysRef.current.add(key);
        e.preventDefault();
      }
    };
    const handleKeyUp = e => {
      const key = e.key.toLowerCase();
      if (["z", "q", "s", "d"].includes(key)) {
        pressedKeysRef.current.delete(key);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateGameState = (timestamp) => {
    previousStateRef.current = {
      snake: gameStateRef.current.snake.map(s => ({ ...s })),
    };
    if (gameStateRef.current.gameOver) return;

    updateBonuses(timestamp);

    const keys = pressedKeysRef.current;
    let vertical = 0, horizontal = 0;
    if (keys.has('z')) vertical = -1;
    if (keys.has('s')) vertical = 1;
    if (keys.has('q')) horizontal = -1;
    if (keys.has('d')) horizontal = 1;

    const oldDirection = gameStateRef.current.direction;
    let newDirection = oldDirection;
    if (vertical !== 0 && horizontal !== 0) {
      if (diagonalCounterRef.current % 2 === 0) {
        newDirection = { x: 0, y: vertical * gridSize };
      } else {
        newDirection = { x: horizontal * gridSize, y: 0 };
      }
      diagonalCounterRef.current++;
    } else if (vertical !== 0) {
      newDirection = { x: 0, y: vertical * gridSize };
    } else if (horizontal !== 0) {
      newDirection = { x: horizontal * gridSize, y: 0 };
    }
    if (newDirection.x === -oldDirection.x && newDirection.y === -oldDirection.y) {
      newDirection = oldDirection;
    }
    gameStateRef.current.direction = newDirection;

    const head = gameStateRef.current.snake[0];
    let newHead = {
      x: head.x + newDirection.x,
      y: head.y + newDirection.y
    };

    for (let i = 0; i < gameStateRef.current.obstacles.length; i++) {
      const obs = gameStateRef.current.obstacles[i];
      if (
        newHead.x < obs.x + obs.width &&
        newHead.x + gridSize > obs.x &&
        newHead.y < obs.y + obs.height &&
        newHead.y + gridSize > obs.y
      ) {
        if (activeBonusesRef.current.some(b => b.type === "passThrough")) {
          gameStateRef.current.obstacles.splice(i, 1);
          i--;
        } else {
          gameStateRef.current.gameOver = true;
          return;
        }
      }
    }

    if (
      newHead.x < 0 ||
      newHead.x >= gameStateRef.current.canvasWidth ||
      newHead.y < 0 ||
      newHead.y >= gameStateRef.current.canvasHeight
    ) {
      if (activeBonusesRef.current.some(b => b.type === "passThrough")) {
        if (newHead.x < 0) newHead.x = gameStateRef.current.canvasWidth - gridSize;
        else if (newHead.x >= gameStateRef.current.canvasWidth) newHead.x = 0;
        if (newHead.y < 0) newHead.y = gameStateRef.current.canvasHeight - gridSize;
        else if (newHead.y >= gameStateRef.current.canvasHeight) newHead.y = 0;
        previousStateRef.current.snake[0] = { ...newHead };
      } else {
        gameStateRef.current.gameOver = true;
        return;
      }
    }

    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      const seg = gameStateRef.current.snake[i];
      if (newHead.x === seg.x && newHead.y === seg.y) {
        gameStateRef.current.gameOver = true;
        return;
      }
    }

    gameStateRef.current.snake.unshift(newHead);

    let eatenApple = null;
    for (let apple of gameStateRef.current.apples) {
      if (newHead.x === apple.x && newHead.y === apple.y) {
        eatenApple = apple;
        break;
      }
    }

    if (eatenApple) {
      if (parseFloat(countdown) > (countdownLimit / 1000) * 0.3) {
        setComboCount(prev => prev + 1);
      } else {
        setComboCount(0);
      }
      let bonusMultiplier = 1;
      const thresholds = [5, 10, 15, 20, 25];
      if (thresholds.includes(comboCount + 1)) bonusMultiplier = 1.3;
      const earnedPoints = Math.floor(10 * bonusMultiplier);
      setPoints(prev => prev + earnedPoints);
      pointEffectsRef.current.push({
        x: eatenApple.x + gridSize / 2,
        y: eatenApple.y + gridSize / 2,
        points: earnedPoints,
        startTime: timestamp,
      });
      applyBonus(eatenApple.effect, timestamp);
      if (eatenApple.effect !== "freeze") {
        applesEatenRef.current++;
        if (applesEatenRef.current % 2 === 0) {
          const avoidPositions = [...gameStateRef.current.snake, ...gameStateRef.current.apples];
          gameStateRef.current.obstacles = generateObstaclesAvoiding(level, canvasWidth, canvasHeight, avoidPositions);
        }
        gameStateRef.current.apples = generateAppleGroup(appleGroupCount, gameStateRef.current.obstacles, canvasWidth, canvasHeight);
        gameStateRef.current.groupFrozen = false;
        groupSpawnTimeRef.current = timestamp;
      } else {
        gameStateRef.current.apples = gameStateRef.current.apples.filter(apple => apple !== eatenApple);
        gameStateRef.current.groupFrozen = true;
        if (gameStateRef.current.apples.length === 0) {
          gameStateRef.current.apples = generateAppleGroup(appleGroupCount, gameStateRef.current.obstacles, canvasWidth, canvasHeight);
          gameStateRef.current.groupFrozen = false;
          groupSpawnTimeRef.current = timestamp;
        }
      }
    } else {
      const timeSinceGroup = timestamp - groupSpawnTimeRef.current;
      if (!gameStateRef.current.groupFrozen && timeSinceGroup >= countdownLimit) {
        if (gameStateRef.current.snake.length > 1) {
          gameStateRef.current.snake.pop();
        } else {
          gameStateRef.current.gameOver = true;
        }
        gameStateRef.current.apples = generateAppleGroup(appleGroupCount, gameStateRef.current.obstacles, canvasWidth, canvasHeight);
        groupSpawnTimeRef.current = timestamp;
        setComboCount(0);
      } else {
        gameStateRef.current.snake.pop();
      }
    }
  };

  const renderGame = (alpha, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les obstacles arrondis en blanc
    for (let obs of gameStateRef.current.obstacles) {
      ctx.fillStyle = 'white';
      roundRect(ctx, obs.x, obs.y, obs.width, obs.height, 5);
    }

    // Apparence du serpent
    const appearance = getSnakeAppearance(activeBonusesRef.current);
    const snakeBaseColor = appearance.base;
    const frames = renderedSnakeRef.current;
    frames.forEach(framePoints => {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (snakeBaseColor === "multicolor") {
        const cycleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#1AAD0E"];
        const index = Math.floor(timestamp / 100) % cycleColors.length;
        ctx.strokeStyle = cycleColors[index];
      } else {
        ctx.strokeStyle = snakeBaseColor;
      }
      ctx.lineWidth = gridSize;
      if (framePoints.length > 0) {
        ctx.moveTo(framePoints[0].x, framePoints[0].y);
        for (let i = 1; i < framePoints.length; i++) {
          ctx.lineTo(framePoints[i].x, framePoints[i].y);
        }
      }
      ctx.stroke();
    });

    const currentSnake = gameStateRef.current.snake;
    const prevSnake = previousStateRef.current.snake;
    const finalPoints = [];
    const commonLen = Math.min(prevSnake.length, currentSnake.length);
    for (let i = 0; i < commonLen; i++) {
      const x = lerp(prevSnake[i].x, currentSnake[i].x, alpha) + gridSize / 2;
      const y = lerp(prevSnake[i].y, currentSnake[i].y, alpha) + gridSize / 2;
      finalPoints.push({ x, y });
    }
    for (let i = commonLen; i < currentSnake.length; i++) {
      finalPoints.push({
        x: currentSnake[i].x + gridSize / 2,
        y: currentSnake[i].y + gridSize / 2
      });
    }

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (snakeBaseColor === "multicolor") {
      const cycleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#1AAD0E"];
      const index = Math.floor(timestamp / 100) % cycleColors.length;
      ctx.strokeStyle = cycleColors[index];
    } else {
      ctx.strokeStyle = snakeBaseColor;
    }
    ctx.lineWidth = gridSize;
    if (finalPoints.length > 0) {
      ctx.moveTo(finalPoints[0].x, finalPoints[0].y);
      for (let i = 1; i < finalPoints.length; i++) {
        ctx.lineTo(finalPoints[i].x, finalPoints[i].y);
      }
    }
    ctx.stroke();

    gameStateRef.current.apples.forEach(apple => {
      const breathScale = 1 + 0.15 * Math.sin(timestamp / 250);
      ctx.save();
      ctx.translate(apple.x + gridSize / 2, apple.y + gridSize / 2);
      ctx.scale(breathScale, breathScale);
      ctx.beginPath();
      ctx.arc(0, 0, gridSize / 2, 0, Math.PI * 2);
      let fillColor = apple.color;
      if (apple.effect === "passThrough") {
        const cycleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#1AAD0E"];
        const index = Math.floor(timestamp / 100) % cycleColors.length;
        fillColor = cycleColors[index];
      }
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.restore();
    });

    const effectDuration = 1000;
    pointEffectsRef.current.forEach(effect => {
      const elapsed = timestamp - effect.startTime;
      const t = elapsed / effectDuration;
      if (t < 1) {
        const offsetY = -50 * t;
        ctx.globalAlpha = 1 - t;
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("+" + effect.points, effect.x, effect.y + offsetY);
        ctx.globalAlpha = 1;
      }
    });
    pointEffectsRef.current = pointEffectsRef.current.filter(
      effect => (timestamp - effect.startTime) < effectDuration
    );

    if (gameStateRef.current.gameOver) {
      ctx.fillStyle = 'black';
      ctx.font = '48px sans-serif';
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }

    renderedSnakeRef.current.push([...finalPoints]);
    if (renderedSnakeRef.current.length > maxTrailFrames) {
      renderedSnakeRef.current.shift();
    }
  };

  const gameLoop = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      groupSpawnTimeRef.current = timestamp;
    }
    setChrono(((timestamp - startTimeRef.current) / 1000).toFixed(1));
    const timeSinceGroup = timestamp - groupSpawnTimeRef.current;
    const timeLeft = Math.max(0, (countdownLimit - timeSinceGroup) / 1000);
    setCountdown(timeLeft.toFixed(1));
    const delta = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;
    accumulatorRef.current += delta;
    while (accumulatorRef.current >= tickDuration) {
      updateGameState(timestamp);
      accumulatorRef.current -= tickDuration;
    }
    const alpha = accumulatorRef.current / tickDuration;
    renderGame(alpha, timestamp);
    if (gameStateRef.current.gameOver) {
      setIsGameOver(true);
      return;
    }
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const restartGame = () => {
    setIsGameOver(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    const now = performance.now();
    gameStateRef.current = {
      snake: initialSnake.map(s => ({ ...s })),
      direction: initialDirection,
      obstacles: generateObstacles(1, canvasWidth, canvasHeight),
      apples: generateAppleGroup(appleGroupCount, [], canvasWidth, canvasHeight),
      canvasWidth,
      canvasHeight,
      gameOver: false,
      groupFrozen: false,
    };
    previousStateRef.current = {
      snake: initialSnake.map(s => ({ ...s })),
    };
    renderedSnakeRef.current = [];
    accumulatorRef.current = 0;
    lastTimestampRef.current = now;
    startTimeRef.current = now;
    groupSpawnTimeRef.current = now;
    diagonalCounterRef.current = 0;
    pressedKeysRef.current.clear();
    setPoints(0);
    setComboCount(0);
    setLevel(1);
    activeBonusesRef.current = [];
    setActiveBonuses([]);
    pointEffectsRef.current = [];
    applesEatenRef.current = 0;
    setBorderFlash(null);
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const quitGame = () => {
    if (typeof onQuit === 'function') onQuit();
  };

  const bonusFeedback = activeBonuses.length > 0 ? activeBonuses.map(bonus => {
    const remaining = Math.max(0, ((bonus.expires - performance.now()) / 1000).toFixed(1));
    const totalDuration = effectDurations[bonus.type] || 1;
    const progress = Math.max(0, Math.min(100, (remaining * 100) / (totalDuration / 1000)));
    const flashStyle = remaining < 1 ? { animation: 'flash 0.5s infinite' } : {};
    return (
      <div
        key={bonus.appliedAt}
        className="effect-item"
        style={{
          marginBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px',
          borderRadius: '4px'
        }}
      >
        <div className="effect-icon" style={{ fontWeight: 'bold', color: 'white', ...flashStyle }}>
          {bonus.type.toUpperCase()}
        </div>
        <div className="effect-time" style={{ marginLeft: '8px', color: 'white' }}>
          {remaining}s
        </div>
        <div
          className="effect-progress"
          style={{
            width: '80px',
            height: '6px',
            backgroundColor: 'gray',
            marginLeft: '8px',
            borderRadius: '3px',
            overflow: 'hidden'
          }}
        >
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'limegreen' }} />
        </div>
      </div>
    );
  }) : <div style={{ color: 'white' }}>Aucun bonus actif</div>;

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      <div className="interface-bar">
        <div>Time: {chrono}s</div>
        <div>Countdown: {countdown}s</div>
        <div>Points: {points}</div>
        <div className="interface-buttons">
          <button onClick={() => setShowOptions(!showOptions)} className="btn">Options</button>
          <button onClick={quitGame} className="btn">Quitter</button>
        </div>
      </div>

      {/* Feedback placé en haut à droite de la zone de jeu */}
      <div
        className="active-effects-panel"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          maxWidth: '200px'
        }}
      >
        {bonusFeedback}
      </div>

      {showOptions && (
        <div className="options-bar">
          <h3>Options</h3>
          <p>Aucune option disponible pour le moment.</p>
        </div>
      )}

      {/* Conteneur du canvas avec position relative pour le flash de bordure */}
      <div
        className="canvas-wrapper"
        style={{
          position: 'relative',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width={canvasWidth}
          height={canvasHeight}
        />

        {/* Bordure flash absolue */}
        {borderFlash && performance.now() < borderFlash.expires && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              boxSizing: 'border-box',
              borderRadius: '10px',
              border: `10px solid ${hexToRgba(borderFlash.color, (borderFlash.expires - performance.now()) / 1000)}`,
              transition: 'border 0.1s'
            }}
          />
        )}

        {gameStateRef.current.gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-popup">
              <h2>Game Over</h2>
              <button onClick={restartGame} className="btn">Rejouer</button>
              <button onClick={quitGame} className="btn">Quitter</button>
            </div>
          </div>
        )}
      </div>

      <div className="mobile-controls">
        <button
          className="mobile-btn"
          onTouchStart={() => pressedKeysRef.current.add("z")}
          onTouchEnd={() => pressedKeysRef.current.delete("z")}
        >
          ↑
        </button>
        <div className="mobile-row">
          <button
            className="mobile-btn"
            onTouchStart={() => pressedKeysRef.current.add("q")}
            onTouchEnd={() => pressedKeysRef.current.delete("q")}
          >
            ←
          </button>
          <button
            className="mobile-btn"
            onTouchStart={() => pressedKeysRef.current.add("s")}
            onTouchEnd={() => pressedKeysRef.current.delete("s")}
          >
            ↓
          </button>
          <button
            className="mobile-btn"
            onTouchStart={() => pressedKeysRef.current.add("d")}
            onTouchEnd={() => pressedKeysRef.current.delete("d")}
          >
            →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SnakeGame;
