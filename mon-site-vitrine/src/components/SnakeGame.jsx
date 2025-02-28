import React, { useRef, useEffect, useState } from 'react';
import './SnakeGame.css';

const tickDuration = 100; // Durée d'un tick en ms
const gridSize = 20;      // Taille d'une cellule (agrandie)
const countdownLimit = 5000; // Temps imparti (ms) pour manger l'objet mangeable

// Fonction d'interpolation linéaire
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Liste des couleurs d'objets mangeables et leurs bonus associés
const appleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#894FFF", "#1AAD0E"];

// État initial du serpent (3 segments) et direction initiale (vers la droite)
const initialSnake = [
  { x: 40, y: 40 },
  { x: 20, y: 40 },
  { x: 0, y: 40 },
];
const initialDirection = { x: gridSize, y: 0 };

// Génère des obstacles selon le niveau (obstacles sous forme de rectangles)
const generateObstacles = (level, canvasWidth, canvasHeight) => {
  const obstacles = [];
  // Par exemple, ajouter jusqu'à 3 obstacles pour le niveau 1, +1 par niveau max 8
  const count = Math.min(3 + level - 1, 8);
  for (let i = 0; i < count; i++) {
    const obstacleWidth = gridSize * (2 + Math.floor(Math.random() * 2)); // 2-3 cellules
    const obstacleHeight = gridSize * (2 + Math.floor(Math.random() * 2));
    const maxX = Math.floor((canvasWidth - obstacleWidth) / gridSize);
    const maxY = Math.floor((canvasHeight - obstacleHeight) / gridSize);
    obstacles.push({
      x: Math.floor(Math.random() * maxX) * gridSize,
      y: Math.floor(Math.random() * maxY) * gridSize,
      width: obstacleWidth,
      height: obstacleHeight
    });
  }
  return obstacles;
};

const SnakeGame = ({ onQuit }) => {
  // Références et états internes
  const canvasRef = useRef(null);
  const accumulatorRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const startTimeRef = useRef(0);
  const appleSpawnTimeRef = useRef(0);
  const diagonalCounterRef = useRef(0);
  const pressedKeysRef = useRef(new Set());
  const animationFrameIdRef = useRef(null);

  // États de l'interface et du jeu
  const [chrono, setChrono] = useState(0);
  const [countdown, setCountdown] = useState((countdownLimit / 1000).toFixed(1));
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [comboCount, setComboCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  // Bonus actif : par exemple { type:"invincible", expires: timestamp }
  const [activeBonus, setActiveBonus] = useState(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  // Game state stocké dans une ref
  const gameStateRef = useRef({
    snake: initialSnake.map(segment => ({ ...segment })),
    direction: initialDirection,
    apple: {
      x: 100,
      y: 100,
      color: appleColors[Math.floor(Math.random() * appleColors.length)]
    },
    obstacles: generateObstacles(level, canvasWidth, canvasHeight),
    canvasWidth,
    canvasHeight,
    gameOver: false,
  });

  const previousStateRef = useRef({
    snake: initialSnake.map(segment => ({ ...segment })),
  });

  // Bonus : applique un bonus en fonction de la couleur de l'objet mangeable
  const applyBonus = (color, timestamp) => {
    let bonus = null;
    switch(color) {
      case "#0000ff": // Bleu : ralentissement temporaire
        bonus = { type: "slow", expires: timestamp + 3000 };
        break;
      case "#008000": // Vert : croissance supplémentaire (+2 segments)
        {
          const tail = gameStateRef.current.snake[gameStateRef.current.snake.length - 1];
          gameStateRef.current.snake.push({ ...tail }, { ...tail });
        }
        break;
      case "#808080": // Gris : bouclier (ignore une collision une fois)
        bonus = { type: "shield", expires: timestamp + 5000 };
        break;
      case "#ffa500": // Orange : double score sur la pomme suivante
        bonus = { type: "double", expires: timestamp + 5000 };
        break;
      case "#800080": // Violet : invincibilité 3 sec
        bonus = { type: "invincible", expires: timestamp + 3000 };
        break;
      default:
        break;
    }
    setActiveBonus(bonus);
  };

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (["z", "q", "s", "d"].includes(key)) {
        pressedKeysRef.current.add(key);
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
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
      snake: gameStateRef.current.snake.map(segment => ({ ...segment })),
    };

    if (gameStateRef.current.gameOver) return;

    // Bonus expire ?
    if (activeBonus && timestamp > activeBonus.expires) {
      setActiveBonus(null);
    }

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
    const newHead = {
      x: head.x + newDirection.x,
      y: head.y + newDirection.y,
    };

    // Collision avec obstacles
    for (let obstacle of gameStateRef.current.obstacles) {
      if (
        newHead.x < obstacle.x + obstacle.width &&
        newHead.x + gridSize > obstacle.x &&
        newHead.y < obstacle.y + obstacle.height &&
        newHead.y + gridSize > obstacle.y
      ) {
        // Si bonus bouclier ou invincible est actif, on l'annule et on ignore la collision
        if (activeBonus && (activeBonus.type === "shield" || activeBonus.type === "invincible")) {
          setActiveBonus(null);
        } else {
          gameStateRef.current.gameOver = true;
          return;
        }
      }
    }

    // Collision avec les murs
    if (
      newHead.x < 0 ||
      newHead.x >= gameStateRef.current.canvasWidth ||
      newHead.y < 0 ||
      newHead.y >= gameStateRef.current.canvasHeight
    ) {
      gameStateRef.current.gameOver = true;
      return;
    }

    // Collision avec le corps
    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      const segment = gameStateRef.current.snake[i];
      if (newHead.x === segment.x && newHead.y === segment.y) {
        if (activeBonus && activeBonus.type === "invincible") {
          setActiveBonus(null);
        } else {
          gameStateRef.current.gameOver = true;
          return;
        }
      }
    }

    gameStateRef.current.snake.unshift(newHead);

    const apple = gameStateRef.current.apple;
    if (newHead.x === apple.x && newHead.y === apple.y) {
      // Combo : si plus de 30% du temps reste, incrémenter comboCount
      if (parseFloat(countdown) > (countdownLimit / 1000) * 0.3) {
        setComboCount(prev => prev + 1);
      } else {
        setComboCount(0);
      }
      // Appliquer bonus combo si combo atteint certains seuils
      let bonusMultiplier = 1;
      const thresholds = [5, 10, 15, 20, 25];
      if (thresholds.includes(comboCount + 1)) {
        bonusMultiplier = 1.3;
      }
      setPoints(prev => prev + Math.floor(10 * bonusMultiplier));

      // Appliquer bonus lié à la couleur de l'apple
      applyBonus(apple.color, timestamp);

      // Augmenter le niveau tous les 100 points par exemple
      if ((points + 10) % 100 === 0) {
        setLevel(prev => prev + 1);
        // Regénérer obstacles pour le nouveau niveau
        gameStateRef.current.obstacles = generateObstacles(level + 1, canvasWidth, canvasHeight);
      }

      const cols = canvasWidth / gridSize;
      const rows = canvasHeight / gridSize;
      gameStateRef.current.apple = {
        x: Math.floor(Math.random() * cols) * gridSize,
        y: Math.floor(Math.random() * rows) * gridSize,
        color: appleColors[Math.floor(Math.random() * appleColors.length)]
      };
      appleSpawnTimeRef.current = timestamp;
    } else {
      gameStateRef.current.snake.pop();
    }
  };

  const renderGame = (alpha, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les obstacles
    for (let obstacle of gameStateRef.current.obstacles) {
      ctx.fillStyle = '#555';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Effet de bounce léger pour le serpent
    const snakeBounce = 2 * Math.sin(timestamp / 500);

    const currentSnake = gameStateRef.current.snake;
    const prevSnake = previousStateRef.current.snake;
    const interpolatedPoints = [];
    const commonLength = Math.min(prevSnake.length, currentSnake.length);
    for (let i = 0; i < commonLength; i++) {
      const interpX = lerp(prevSnake[i].x, currentSnake[i].x, alpha) + gridSize / 2;
      const interpY = lerp(prevSnake[i].y, currentSnake[i].y, alpha) + gridSize / 2 + snakeBounce;
      interpolatedPoints.push({ x: interpX, y: interpY });
    }
    for (let i = commonLength; i < currentSnake.length; i++) {
      interpolatedPoints.push({
        x: currentSnake[i].x + gridSize / 2,
        y: currentSnake[i].y + gridSize / 2 + snakeBounce,
      });
    }

    // Si un bonus actif (par exemple "slow"), on peut changer légèrement la couleur
    let snakeColor = activeBonus && activeBonus.type === "slow" ? "#00aa00" : "green";

    if (interpolatedPoints.length === 1) {
      ctx.beginPath();
      ctx.fillStyle = snakeColor;
      ctx.arc(interpolatedPoints[0].x, interpolatedPoints[0].y, gridSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (interpolatedPoints.length > 1) {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = snakeColor;
      ctx.lineWidth = gridSize;
      ctx.moveTo(interpolatedPoints[0].x, interpolatedPoints[0].y);
      for (let i = 1; i < interpolatedPoints.length; i++) {
        ctx.lineTo(interpolatedPoints[i].x, interpolatedPoints[i].y);
      }
      ctx.stroke();
    }

    const apple = gameStateRef.current.apple;
    const breathScale = 1 + 0.15 * Math.sin(timestamp / 250);
    ctx.save();
    ctx.translate(apple.x + gridSize / 2, apple.y + gridSize / 2);
    ctx.scale(breathScale, breathScale);
    ctx.beginPath();
    ctx.arc(0, 0, gridSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = apple.color;
    ctx.fill();
    ctx.restore();

    if (gameStateRef.current.gameOver) {
      ctx.fillStyle = 'black';
      ctx.font = '48px sans-serif';
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
  };

  const gameLoop = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      appleSpawnTimeRef.current = timestamp;
      gameStateRef.current.obstacles = generateObstacles(level, canvasWidth, canvasHeight);
    }
    setChrono(((timestamp - startTimeRef.current) / 1000).toFixed(1));
    const timeSinceApple = timestamp - appleSpawnTimeRef.current;
    const timeLeft = Math.max(0, (countdownLimit - timeSinceApple) / 1000);
    setCountdown(timeLeft.toFixed(1));
    if (timeSinceApple >= countdownLimit) {
      if (gameStateRef.current.snake.length > 1) {
        gameStateRef.current.snake.pop();
      } else {
        gameStateRef.current.gameOver = true;
      }
      appleSpawnTimeRef.current = timestamp;
      setComboCount(0);
    }
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
      snake: initialSnake.map(segment => ({ ...segment })),
      direction: initialDirection,
      apple: {
        x: 100,
        y: 100,
        color: appleColors[Math.floor(Math.random() * appleColors.length)]
      },
      obstacles: generateObstacles(1, canvasWidth, canvasHeight),
      canvasWidth,
      canvasHeight,
      gameOver: false,
    };
    previousStateRef.current = {
      snake: initialSnake.map(segment => ({ ...segment })),
    };
    accumulatorRef.current = 0;
    lastTimestampRef.current = now;
    startTimeRef.current = now;
    appleSpawnTimeRef.current = now;
    diagonalCounterRef.current = 0;
    pressedKeysRef.current = new Set();
    setPoints(0);
    setComboCount(0);
    setLevel(1);
    setActiveBonus(null);
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const quitGame = () => {
    if (typeof onQuit === 'function') {
      onQuit();
    }
  };

  return (
    <div className="game-container">
      <div className="interface-bar">
        <div>Time: {chrono}s</div>
        <div>Countdown: {countdown}s</div>
        <div>Points: {points}</div>
        <div className="interface-buttons">
          <button onClick={() => setShowOptions(!showOptions)} className="btn">Options</button>
          <button onClick={quitGame} className="btn">Quitter</button>
        </div>
      </div>
      {showOptions && (
        <div className="options-bar">
          <h3>Options</h3>
          <p>Aucune option disponible pour le moment.</p>
        </div>
      )}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width={canvasWidth}
          height={canvasHeight}
        />
        {isGameOver && (
          <div className="game-over-overlay">
            <div className="game-over-popup">
              <h2>Game Over</h2>
              <button onClick={restartGame} className="btn">Rejouer</button>
              <button onClick={quitGame} className="btn">Quitter</button>
            </div>
          </div>
        )}
      </div>
      {/* Contrôles mobiles */}
      <div className="mobile-controls">
        <button className="mobile-btn" onTouchStart={() => pressedKeysRef.current.add("z")} onTouchEnd={() => pressedKeysRef.current.delete("z")}>↑</button>
        <div className="mobile-row">
          <button className="mobile-btn" onTouchStart={() => pressedKeysRef.current.add("q")} onTouchEnd={() => pressedKeysRef.current.delete("q")}>←</button>
          <button className="mobile-btn" onTouchStart={() => pressedKeysRef.current.add("s")} onTouchEnd={() => pressedKeysRef.current.delete("s")}>↓</button>
          <button className="mobile-btn" onTouchStart={() => pressedKeysRef.current.add("d")} onTouchEnd={() => pressedKeysRef.current.delete("d")}>→</button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
