import React, { useRef, useEffect, useState } from 'react';
import './SnakeGame.css';

const tickDuration = 100;      // Durée d'un tick en ms (mise à jour fixe)
const gridSize = 20;          // Taille d'une cellule
const countdownLimit = 5000;  // Temps imparti pour manger l'objet mangeable

// Interpolation linéaire
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Palette de couleurs pour les pommes
const appleColors = ["#828282", "#FF0000", "#FFAD00", "#00A1FF", "#894FFF", "#1AAD0E"];

/**
 * Génère des obstacles aléatoires en fonction du niveau
 */
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

/**
 * Place la pomme à une position aléatoire en évitant les obstacles
 */
const placeAppleOutsideObstacles = (obstacles, canvasWidth, canvasHeight) => {
  const cols = canvasWidth / gridSize;
  const rows = canvasHeight / gridSize;
  let tries = 0;
  let maxTries = 100;  // Limite pour éviter une boucle infinie
  while (tries < maxTries) {
    const x = Math.floor(Math.random() * cols) * gridSize;
    const y = Math.floor(Math.random() * rows) * gridSize;
    // Vérifier si (x, y) chevauche un obstacle
    let collides = false;
    for (let obs of obstacles) {
      if (
        x < obs.x + obs.width &&
        x + gridSize > obs.x &&
        y < obs.y + obs.height &&
        y + gridSize > obs.y
      ) {
        collides = true;
        break;
      }
    }
    if (!collides) {
      // Choisir une couleur aléatoire
      const color = appleColors[Math.floor(Math.random() * appleColors.length)];
      return { x, y, color };
    }
    tries++;
  }
  // Si on n'a pas trouvé de place, on retourne quand même quelque chose
  return {
    x: 0,
    y: 0,
    color: appleColors[Math.floor(Math.random() * appleColors.length)]
  };
};

const initialSnake = [
  { x: 40, y: 40 },
  { x: 20, y: 40 },
  { x: 0, y: 40 },
];
const initialDirection = { x: gridSize, y: 0 };

const SnakeGame = ({ onQuit }) => {
  const canvasRef = useRef(null);
  const accumulatorRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const startTimeRef = useRef(0);
  const appleSpawnTimeRef = useRef(0);
  const diagonalCounterRef = useRef(0);
  const pressedKeysRef = useRef(new Set());
  const animationFrameIdRef = useRef(null);

  // Stocke les frames déjà rendues du serpent pour la traînée
  const renderedSnakeRef = useRef([]);
  const maxTrailFrames = 30; // Nombre de frames de traînée

  // Référence pour les effets de points
  const pointEffectsRef = useRef([]);

  // États React pour l'interface
  const [chrono, setChrono] = useState(0);
  const [countdown, setCountdown] = useState((countdownLimit / 1000).toFixed(1));
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [comboCount, setComboCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeBonus, setActiveBonus] = useState(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  // État interne du jeu
  const gameStateRef = useRef({
    snake: initialSnake.map(s => ({ ...s })),
    direction: initialDirection,
    apple: {
      ...placeAppleOutsideObstacles([], 800, 600),
    },
    obstacles: generateObstacles(level, canvasWidth, canvasHeight),
    canvasWidth,
    canvasHeight,
    gameOver: false,
  });

  // Sauvegarde de l'état précédent du serpent (pour l'interpolation)
  const previousStateRef = useRef({
    snake: initialSnake.map(s => ({ ...s })),
  });

  /**
   * Applique un bonus en fonction de la couleur de la pomme
   */
  const applyBonus = (color, timestamp) => {
    let bonus = null;
    switch (color) {
      case "#FF0000":
        // pas de bonus
        break;
      case "#FFAD00":
        // slow
        bonus = { type: "slow", expires: timestamp + 3000 };
        break;
      case "#00A1FF":
        // +2 segments
        {
          const tail = gameStateRef.current.snake[gameStateRef.current.snake.length - 1];
          gameStateRef.current.snake.push({ ...tail }, { ...tail });
        }
        break;
      case "#894FFF":
        // shield
        bonus = { type: "shield", expires: timestamp + 5000 };
        break;
      case "#1AAD0E":
        // invincible
        bonus = { type: "invincible", expires: timestamp + 3000 };
        break;
      default:
        break;
    }
    setActiveBonus(bonus);
  };

  // Gestion des touches
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

  /**
   * Met à jour la logique du jeu (collisions, déplacements, etc.)
   */
  const updateGameState = (timestamp) => {
    previousStateRef.current = {
      snake: gameStateRef.current.snake.map(s => ({ ...s })),
    };

    if (gameStateRef.current.gameOver) return;

    // Bonus expiré ?
    if (activeBonus && timestamp > activeBonus.expires) {
      setActiveBonus(null);
    }

    // Gestion direction
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

    // Interdire l'inversion directe
    if (newDirection.x === -oldDirection.x && newDirection.y === -oldDirection.y) {
      newDirection = oldDirection;
    }
    gameStateRef.current.direction = newDirection;

    // Calcul newHead
    const head = gameStateRef.current.snake[0];
    const newHead = {
      x: head.x + newDirection.x,
      y: head.y + newDirection.y
    };

    // Collisions obstacles => game over
    for (let obs of gameStateRef.current.obstacles) {
      if (
        newHead.x < obs.x + obs.width &&
        newHead.x + gridSize > obs.x &&
        newHead.y < obs.y + obs.height &&
        newHead.y + gridSize > obs.y
      ) {
        gameStateRef.current.gameOver = true;
        return;
      }
    }

    // Collisions murs => game over
    if (
      newHead.x < 0 ||
      newHead.x >= gameStateRef.current.canvasWidth ||
      newHead.y < 0 ||
      newHead.y >= gameStateRef.current.canvasHeight
    ) {
      gameStateRef.current.gameOver = true;
      return;
    }

    // Collisions corps
    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      const seg = gameStateRef.current.snake[i];
      if (newHead.x === seg.x && newHead.y === seg.y) {
        if (activeBonus && activeBonus.type === "invincible") {
          setActiveBonus(null);
        } else {
          gameStateRef.current.gameOver = true;
          return;
        }
      }
    }

    // Avancer le serpent
    gameStateRef.current.snake.unshift(newHead);

    // Vérifier si on mange la pomme
    const apple = gameStateRef.current.apple;
    if (newHead.x === apple.x && newHead.y === apple.y) {
      if (parseFloat(countdown) > (countdownLimit / 1000) * 0.3) {
        setComboCount(prev => prev + 1);
      } else {
        setComboCount(0);
      }
      let bonusMultiplier = 1;
      const thresholds = [5, 10, 15, 20, 25];
      if (thresholds.includes(comboCount + 1)) {
        bonusMultiplier = 1.3;
      }
      const earnedPoints = Math.floor(10 * bonusMultiplier);
      setPoints(prev => prev + earnedPoints);

      // Ajout de l'effet de points à l'endroit de la pomme
      pointEffectsRef.current.push({
        x: apple.x + gridSize / 2,
        y: apple.y + gridSize / 2,
        points: earnedPoints,
        startTime: timestamp,
      });

      // Appliquer bonus
      applyBonus(apple.color, timestamp);

      if ((points + 10) % 100 === 0) {
        setLevel(prev => prev + 1);
        gameStateRef.current.obstacles = generateObstacles(
          level + 1,
          gameStateRef.current.canvasWidth,
          gameStateRef.current.canvasHeight
        );
      }

      const newApple = placeAppleOutsideObstacles(
        gameStateRef.current.obstacles,
        gameStateRef.current.canvasWidth,
        gameStateRef.current.canvasHeight
      );
      gameStateRef.current.apple = newApple;
      appleSpawnTimeRef.current = timestamp;
    } else {
      gameStateRef.current.snake.pop();
    }
  };

  /**
   * Dessine le jeu (traînée, serpent, pomme)
   */
  const renderGame = (alpha, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Nettoyage
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessin obstacles
    for (let obs of gameStateRef.current.obstacles) {
      ctx.fillStyle = '#555';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Dessin de la traînée
    const frames = renderedSnakeRef.current;
    const trailLen = frames.length;
    frames.forEach((framePoints, idx) => {
      const alphaTrail = 0.1 + (0.7 * (idx / (trailLen - 1 || 1)));
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(0,128,0,${alphaTrail})`;
      ctx.lineWidth = gridSize;
      if (framePoints.length > 0) {
        ctx.moveTo(framePoints[0].x, framePoints[0].y);
        for (let i = 1; i < framePoints.length; i++) {
          ctx.lineTo(framePoints[i].x, framePoints[i].y);
        }
      }
      ctx.stroke();
    });

    // Calculer l'interpolation du serpent courant
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

    // Dessin du serpent actuel
    let snakeColor = activeBonus && activeBonus.type === "slow" ? "#00aa00" : "green";
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = snakeColor;
    ctx.lineWidth = gridSize;
    if (finalPoints.length > 0) {
      ctx.moveTo(finalPoints[0].x, finalPoints[0].y);
      for (let i = 1; i < finalPoints.length; i++) {
        ctx.lineTo(finalPoints[i].x, finalPoints[i].y);
      }
    }
    ctx.stroke();

    // Dessin de la pomme
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

    // Dessin des effets de points (animation qui s'envole et s'estompe)
    const effectDuration = 1000; // Durée de l'animation en ms
    pointEffectsRef.current.forEach(effect => {
      const elapsed = timestamp - effect.startTime;
      const t = elapsed / effectDuration;
      if (t < 1) {
        const offsetY = -50 * t; // L'effet se déplace vers le haut
        ctx.globalAlpha = 1 - t; // L'opacité diminue
        ctx.font = "20px Arial";
        ctx.fillStyle = "rgb(255,215,0)";
        ctx.fillText("+" + effect.points, effect.x, effect.y + offsetY);
        ctx.globalAlpha = 1;
      }
    });
    // Nettoyer les effets expirés
    pointEffectsRef.current = pointEffectsRef.current.filter(
      effect => (timestamp - effect.startTime) < effectDuration
    );

    // Dessin du "Game Over" si besoin
    if (gameStateRef.current.gameOver) {
      ctx.fillStyle = 'black';
      ctx.font = '48px sans-serif';
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }

    // Enregistrer la version dessinée du serpent pour la traînée
    renderedSnakeRef.current.push([...finalPoints]);
    if (renderedSnakeRef.current.length > maxTrailFrames) {
      renderedSnakeRef.current.shift();
    }
  };

  /**
   * Boucle de jeu
   */
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

  // Démarrage de la boucle
  useEffect(() => {
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  /**
   * Redémarrer la partie
   */
  const restartGame = () => {
    setIsGameOver(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    const now = performance.now();
    gameStateRef.current = {
      snake: initialSnake.map(s => ({ ...s })),
      direction: initialDirection,
      apple: {
        ...placeAppleOutsideObstacles([], 800, 600),
      },
      obstacles: generateObstacles(1, canvasWidth, canvasHeight),
      canvasWidth,
      canvasHeight,
      gameOver: false,
    };
    previousStateRef.current = {
      snake: initialSnake.map(s => ({ ...s })),
    };
    renderedSnakeRef.current = [];
    accumulatorRef.current = 0;
    lastTimestampRef.current = now;
    startTimeRef.current = now;
    appleSpawnTimeRef.current = now;
    diagonalCounterRef.current = 0;
    pressedKeysRef.current.clear();
    setPoints(0);
    setComboCount(0);
    setLevel(1);
    setActiveBonus(null);
    pointEffectsRef.current = [];

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
    </div>
  );
};

export default SnakeGame;
