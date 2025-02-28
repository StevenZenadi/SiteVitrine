import React, { useRef, useEffect, useState } from 'react';
import './SnakeGame.css';

const tickDuration = 100; // Durée d'un tick en ms
const gridSize = 20;      // Taille d'une cellule (agrandie)
const countdownLimit = 5000; // Temps imparti (ms) pour manger l'objet mangeable

// Fonction d'interpolation linéaire
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const appleColors = ["#ff0000", "#0000ff", "#008000", "#808080", "#ffa500", "#800080"];

const initialSnake = [
  { x: 40, y: 40 },
  { x: 20, y: 40 },
  { x: 0, y: 40 },
];
const initialDirection = { x: gridSize, y: 0 };

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

  const [chrono, setChrono] = useState(0);
  const [countdown, setCountdown] = useState((countdownLimit / 1000).toFixed(1));
  const [points, setPoints] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Pour les contrôles tactiles, on peut gérer un state "mobileDirection"
  // qui sera mis à jour lors des pressions sur les boutons.
  // On injecte ces directions dans pressedKeysRef de manière temporaire.
  const handleMobileDirection = (dir) => {
    // Dir peut être "up", "down", "left", "right"
    // On simule les touches Z, S, Q, D respectivement.
    pressedKeysRef.current = new Set(); // On réinitialise pour un contrôle "instantané"
    if (dir === "up") pressedKeysRef.current.add("z");
    if (dir === "down") pressedKeysRef.current.add("s");
    if (dir === "left") pressedKeysRef.current.add("q");
    if (dir === "right") pressedKeysRef.current.add("d");
  };

  const clearMobileDirection = () => {
    pressedKeysRef.current.clear();
  };

  const gameStateRef = useRef({
    snake: initialSnake.map(segment => ({ ...segment })),
    direction: initialDirection,
    apple: {
      x: 100,
      y: 100,
      color: appleColors[Math.floor(Math.random() * appleColors.length)]
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameOver: false,
  });

  const previousStateRef = useRef({
    snake: initialSnake.map(segment => ({ ...segment })),
  });

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

    if (
      newHead.x < 0 ||
      newHead.x >= gameStateRef.current.canvasWidth ||
      newHead.y < 0 ||
      newHead.y >= gameStateRef.current.canvasHeight
    ) {
      gameStateRef.current.gameOver = true;
      return;
    }

    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      const segment = gameStateRef.current.snake[i];
      if (newHead.x === segment.x && newHead.y === segment.y) {
        gameStateRef.current.gameOver = true;
        return;
      }
    }

    gameStateRef.current.snake.unshift(newHead);

    const apple = gameStateRef.current.apple;
    if (newHead.x === apple.x && newHead.y === apple.y) {
      setPoints(prev => prev + 10);
      const cols = gameStateRef.current.canvasWidth / gridSize;
      const rows = gameStateRef.current.canvasHeight / gridSize;
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

    if (interpolatedPoints.length === 1) {
      ctx.beginPath();
      ctx.fillStyle = 'green';
      ctx.arc(interpolatedPoints[0].x, interpolatedPoints[0].y, gridSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (interpolatedPoints.length > 1) {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'green';
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
      canvasWidth: 800,
      canvasHeight: 600,
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
          width={gameStateRef.current.canvasWidth}
          height={gameStateRef.current.canvasHeight}
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
      {/* Mobile controls */}
      <div className="mobile-controls">
        <button className="mobile-btn" onTouchStart={() => handleMobileDirection("up")} onTouchEnd={clearMobileDirection}>↑</button>
        <div className="mobile-row">
          <button className="mobile-btn" onTouchStart={() => handleMobileDirection("left")} onTouchEnd={clearMobileDirection}>←</button>
          <button className="mobile-btn" onTouchStart={() => handleMobileDirection("down")} onTouchEnd={clearMobileDirection}>↓</button>
          <button className="mobile-btn" onTouchStart={() => handleMobileDirection("right")} onTouchEnd={clearMobileDirection}>→</button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
