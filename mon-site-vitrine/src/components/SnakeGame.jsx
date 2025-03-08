import React, { useRef, useEffect, useState } from 'react';
import './SnakeGame.css';

const tickDuration = 100;      // Durée d'un tick en ms
const gridSize = 20;           // Taille d'une cellule
const countdownLimit = 5000;   // Temps imparti pour manger un groupe de pommes

// Interpolation linéaire
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Convertir un hex en rgba
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

// Dessiner un rectangle avec coins arrondis
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

// Explosion de particules
function spawnParticleExplosion(x, y, color, count = 20) {
  const now = performance.now();
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1000,
      startTime: now,
      color
    });
  }
  return particles;
}

// Définition des boosts disponibles
const appleEffects = [
  { color: "#828282", effect: "extensionTemps", label: "EXT", probability: 0.15 },
  { color: "#FF0000", effect: "boostScore", label: "BOOST", probability: 0.15 },
  { color: "#00A1FF", effect: "freeze", label: "FREEZE", probability: 0.15 },
  { color: "#894FFF", effect: "segmentsSupp", label: "SEG+", probability: 0.15 },
  { color: "#FFFFFF", effect: "passThrough", label: "PASS", probability: 0.5 },
  { color: "#FFAD00", effect: "magnet", label: "MAG", probability: 0.15 },
  { color: "#1AAD0E", effect: "slow", label: "SLOW", probability: 0.15 }
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

function generateObstacles(level, canvasWidth, canvasHeight, snakeLength = 3, avoidPositions = []) {
  const count = Math.min(8, Math.max(3, 8 - Math.floor(snakeLength / 5)));
  const obstacles = [];
  const now = performance.now();
  const maxTries = 100;
  const avoidMargin = gridSize;
  for (let i = 0; i < count; i++) {
    let tries = 0;
    let obstacle;
    let valid = false;
    while (tries < maxTries && !valid) {
      const obstacleWidth = gridSize * (2 + Math.floor(Math.random() * 2));
      const obstacleHeight = gridSize * (2 + Math.floor(Math.random() * 2));
      const maxX = Math.floor((canvasWidth - obstacleWidth) / gridSize);
      const maxY = Math.floor((canvasHeight - obstacleHeight) / gridSize);
      const x = Math.floor(Math.random() * maxX) * gridSize;
      const y = Math.floor(Math.random() * maxY) * gridSize;
      obstacle = { x, y, width: obstacleWidth, height: obstacleHeight, spawnTime: now };
      valid = true;
      for (const pos of avoidPositions) {
        if (
          pos.x - avoidMargin < obstacle.x + obstacle.width &&
          pos.x + gridSize + avoidMargin > obstacle.x &&
          pos.y - avoidMargin < obstacle.y + obstacle.height &&
          pos.y + gridSize + avoidMargin > obstacle.y
        ) {
          valid = false;
          break;
        }
      }
      tries++;
    }
    if (valid) obstacles.push(obstacle);
  }
  return obstacles;
}

function generateObstaclesAvoiding(level, canvasWidth, canvasHeight, avoidPositions) {
  return generateObstacles(level, canvasWidth, canvasHeight, 3, avoidPositions);
}

const initialSnake = [
  { x: 40, y: 40 },
  { x: 20, y: 40 },
  { x: 0, y: 40 }
];
const initialDirection = { x: gridSize, y: 0 };

const initialAvoidPositions = [];
initialSnake.forEach(cell => {
  initialAvoidPositions.push({ ...cell });
  initialAvoidPositions.push({ x: cell.x + gridSize, y: cell.y });
  initialAvoidPositions.push({ x: cell.x - gridSize, y: cell.y });
  initialAvoidPositions.push({ x: cell.x, y: cell.y + gridSize });
  initialAvoidPositions.push({ x: cell.x, y: cell.y - gridSize });
});
initialAvoidPositions.push({ x: initialSnake[0].x + initialDirection.x, y: initialSnake[0].y + initialDirection.y });
initialAvoidPositions.push({ x: initialSnake[0].x + 2 * initialDirection.x, y: initialSnake[0].y + 2 * initialDirection.y });

const effectDurations = {
  extensionTemps: 3000,
  boostScore: 3000,
  passThrough: 5000,
  freeze: 4000,
  segmentsSupp: 4000,
  magnet: 3000,
  slow: 3000
};

const bonusRank = {
  freeze: 1,
  extensionTemps: 1,
  slow: 1,
  passThrough: 2,
  boostScore: 3,
  segmentsSupp: 4,
  magnet: 5
};

function bonusColor(type) {
  switch (type) {
    case "passThrough": return "multicolor";
    case "freeze": return "#00A1FF";
    case "boostScore": return "#FF0000";
    case "extensionTemps": return "#828282";
    case "segmentsSupp": return "#894FFF";
    case "magnet": return "#FFAD00";
    case "slow": return "#1AAD0E";
    default: return "green";
  }
}

// Calcule la couleur de la jauge en fonction du temps restant
function getGaugeColor(remaining, total) {
  let ratio = remaining / total;
  let hue;
  if (ratio >= 0.5) {
    let ratioPrime = (ratio - 0.5) / 0.5; // de 0 à 1
    hue = 30 + ratioPrime * 90; // de 30 (orange) à 120 (vert)
  } else {
    let ratioPrime = ratio / 0.5; // de 0 à 1
    hue = ratioPrime * 30; // de 0 (rouge) à 30 (orange)
  }
  return `hsl(${hue}, 100%, 50%)`;
}

// Pour déterminer l'apparence du serpent en fonction des boosts actifs
function getSnakeAppearance(activeBonuses) {
  if (activeBonuses.length === 0) return { base: "green", secondary: null };
  const bestBonus = activeBonuses.reduce((prev, curr) =>
    bonusRank[curr.type] > bonusRank[prev.type] ? curr : prev
  );
  return { base: bonusColor(bestBonus.type), secondary: null };
}

// Contrôles par swipe
const useSwipeControls = (setDirection) => {
  const touchStartRef = useRef(null);
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
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

const SnakeGame = () => {
  const [showHelp, setShowHelp] = useState(true);
  const bonusTextEffectsRef = useRef([]);
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
  const [borderFlash, setBorderFlash] = useState(null);
  const particlesRef = useRef([]);
  const [chrono, setChrono] = useState(0);
  const [countdown, setCountdown] = useState((countdownLimit / 1000).toFixed(1));
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [comboCount, setComboCount] = useState(0);
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
    obstacles: generateObstacles(1, canvasWidth, canvasHeight, initialSnake.length, initialAvoidPositions),
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
      snake: gameStateRef.current.snake.map(s => ({ ...s }))
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
          spawnParticleExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2, "white", 30)
            .forEach(p => particlesRef.current.push(p));
          setPoints(prev => prev + 50);
          bonusTextEffectsRef.current.push({
            x: obs.x + obs.width / 2,
            y: obs.y + obs.height / 2,
            text: "+50",
            startTime: timestamp,
            duration: 500
          });
          gameStateRef.current.obstacles.splice(i, 1);
          i--;
        } else {
          gameStateRef.current.gameOver = true;
          return;
        }
      }
    }
    if (!activeBonusesRef.current.some(b => b.type === "passThrough")) {
      for (let i = 1; i < gameStateRef.current.snake.length; i++) {
        const seg = gameStateRef.current.snake[i];
        if (newHead.x === seg.x && newHead.y === seg.y) {
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
      gameStateRef.current.gameOver = true;
      return;
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
        startTime: timestamp
      });
      spawnParticleExplosion(eatenApple.x + gridSize / 2, eatenApple.y + gridSize / 2, eatenApple.color, 40)
        .forEach(p => particlesRef.current.push(p));
      bonusTextEffectsRef.current.push({
        x: eatenApple.x + gridSize / 2,
        y: eatenApple.y + gridSize / 2,
        text: eatenApple.label,
        startTime: timestamp,
        duration: 500
      });
      applyBonus(eatenApple.effect, timestamp);
      if (eatenApple.effect !== "freeze") {
        applesEatenRef.current++;
        const avoidPositions = [...gameStateRef.current.snake, ...gameStateRef.current.apples];
        gameStateRef.current.obstacles = generateObstacles(level, canvasWidth, canvasHeight, gameStateRef.current.snake.length, avoidPositions);
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
        if (gameStateRef.current.snake.length > 2) {
          gameStateRef.current.snake.pop();
          gameStateRef.current.snake.pop();
        } else {
          gameStateRef.current.gameOver = true;
        }
        gameStateRef.current.apples = generateAppleGroup(appleGroupCount, gameStateRef.current.obstacles, canvasWidth, canvasHeight);
        const avoidPositions = [...gameStateRef.current.snake, ...gameStateRef.current.apples];
        gameStateRef.current.obstacles = generateObstacles(level, canvasWidth, canvasHeight, gameStateRef.current.snake.length, avoidPositions);
        groupSpawnTimeRef.current = timestamp;
        setComboCount(0);
      } else {
        gameStateRef.current.snake.pop();
      }
    }
  };

  // Regrouper les boosts par type pour afficher un seul élément par boost avec un badge si plusieurs instances sont actives
  const groupedBoosts = Object.values(
    activeBonuses.reduce((acc, bonus) => {
      const currentRemaining = (bonus.expires - performance.now()) / 1000;
      if (acc[bonus.type]) {
        acc[bonus.type].count += 1;
        acc[bonus.type].remaining = Math.max(acc[bonus.type].remaining, currentRemaining);
      } else {
        acc[bonus.type] = {
          type: bonus.type,
          count: 1,
          remaining: currentRemaining,
          total: effectDurations[bonus.type] / 1000
        };
      }
      return acc;
    }, {})
  );

  const renderGame = (alpha, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les obstacles
    for (let obs of gameStateRef.current.obstacles) {
      let fadeFactor = 1;
      if (obs.spawnTime) {
        fadeFactor = Math.min(1, (timestamp - obs.spawnTime) / 500);
      }
      ctx.globalAlpha = fadeFactor;
      ctx.fillStyle = 'white';
      roundRect(ctx, obs.x, obs.y, obs.width, obs.height, 5);
      ctx.globalAlpha = 1;
    }

    // Dessiner le serpent
    const appearance = getSnakeAppearance(activeBonusesRef.current);
    const snakeBaseColor = appearance.base;
    const frames = renderedSnakeRef.current;
    if (snakeBaseColor === "multicolor") {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#FFFFFF";
      frames.forEach(framePoints => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const cycleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#1AAD0E"];
        const index = Math.floor(timestamp / 100) % cycleColors.length;
        ctx.strokeStyle = cycleColors[index];
        ctx.lineWidth = gridSize;
        if (framePoints.length > 0) {
          ctx.moveTo(framePoints[0].x, framePoints[0].y);
          for (let i = 1; i < framePoints.length; i++) {
            ctx.lineTo(framePoints[i].x, framePoints[i].y);
          }
        }
        ctx.stroke();
      });
      ctx.restore();
    } else {
      frames.forEach(framePoints => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = snakeBaseColor;
        ctx.lineWidth = gridSize;
        if (framePoints.length > 0) {
          ctx.moveTo(framePoints[0].x, framePoints[0].y);
          for (let i = 1; i < framePoints.length; i++) {
            ctx.lineTo(framePoints[i].x, framePoints[i].y);
          }
        }
        ctx.stroke();
      });
    }

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

    particlesRef.current.forEach((particle, index) => {
      const elapsed = timestamp - particle.startTime;
      const t = elapsed / particle.life;
      if (t < 1) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        particlesRef.current.splice(index, 1);
      }
    });

    bonusTextEffectsRef.current.forEach((effect, index) => {
      const elapsed = timestamp - effect.startTime;
      const t = elapsed / effect.duration;
      if (t < 1) {
        const alpha = 1 - t;
        ctx.globalAlpha = alpha;
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = `rgba(212,175,55,${alpha})`;
        ctx.textAlign = "center";
        ctx.fillText(effect.text, effect.x, effect.y);
        ctx.globalAlpha = 1;
      } else {
        bonusTextEffectsRef.current.splice(index, 1);
      }
    });

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
    if (!showHelp) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [showHelp]);

  const restartGame = () => {
    setIsGameOver(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    const now = performance.now();
    const restartAvoidPositions = [];
    initialSnake.forEach(cell => {
      restartAvoidPositions.push({ ...cell });
      restartAvoidPositions.push({ x: cell.x + gridSize, y: cell.y });
      restartAvoidPositions.push({ x: cell.x - gridSize, y: cell.y });
      restartAvoidPositions.push({ x: cell.x, y: cell.y + gridSize });
      restartAvoidPositions.push({ x: cell.x, y: cell.y - gridSize });
    });
    restartAvoidPositions.push({ x: initialSnake[0].x + initialDirection.x, y: initialSnake[0].y + initialDirection.y });
    restartAvoidPositions.push({ x: initialSnake[0].x + 2 * initialDirection.x, y: initialSnake[0].y + 2 * initialDirection.y });

    gameStateRef.current = {
      snake: initialSnake.map(s => ({ ...s })),
      direction: initialDirection,
      obstacles: generateObstacles(1, canvasWidth, canvasHeight, initialSnake.length, restartAvoidPositions),
      apples: generateAppleGroup(appleGroupCount, [], canvasWidth, canvasHeight),
      canvasWidth,
      canvasHeight,
      gameOver: false,
      groupFrozen: false,
    };
    previousStateRef.current = {
      snake: initialSnake.map(s => ({ ...s }))
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

  const helpOverlay = (
    <div className="help-overlay">
      <h1>Bienvenue dans Neon Snake !</h1>
      <p>
        Contrôlez le serpent en glissant sur l'écran.<br />
        Chaque pomme possède un effet spécifique.<br />
        Les obstacles apparaissent progressivement et évitent de se placer sur le serpent ou juste devant lui.<br />
        Faites attention : à l'expiration du timer, le serpent perd deux segments !
      </p>
      <button className="btn" onClick={() => setShowHelp(false)}>
        Play
      </button>
    </div>
  );

  const gameOverOverlay = (
    <div className="game-over-overlay">
      <div className="game-over-popup">
        <h2>Game Over</h2>
        <p>Score : {points}</p>
        <p>Temps : {chrono}s</p>
        <p>Niveau : {level}</p>
        <button onClick={restartGame} className="btn">Rejouer</button>
      </div>
    </div>
  );

  return (
    <div className="game-container">
      <div className="interface-bar">
        <div className="game-stats">
          <div>Time: {chrono}s</div>
          <div>Countdown: {countdown}s</div>
          <div>Points: {points}</div>
        </div>
        <div className="boosts-container">
          {groupedBoosts.length > 0 &&
            groupedBoosts.map(boost => {
              const percentage = Math.min(100, (boost.remaining / boost.total) * 100);
              const gaugeColor = getGaugeColor(boost.remaining, boost.total);
              return (
                <div key={boost.type} className="boost-item">
                  <div className="boost-name">
                    {boost.type.toUpperCase()}
                    {boost.count > 1 && <span className="boost-count">*{boost.count}</span>}
                  </div>
                  <div className="boost-time">{boost.remaining.toFixed(1)}s</div>
                  <div className="boost-gauge">
                    <div className="boost-gauge-fill" style={{ width: `${percentage}%`, backgroundColor: gaugeColor }}></div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      <div className="canvas-wrapper"
           onTouchStart={handleTouchStart}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}>
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width={canvasWidth}
          height={canvasHeight}
        />

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

        {gameStateRef.current.gameOver && gameOverOverlay}
        {showHelp && helpOverlay}
      </div>
    </div>
  );
};

export default SnakeGame;
