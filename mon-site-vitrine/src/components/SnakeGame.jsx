// src/components/SnakeGame.jsx
import React, { useRef, useState, useEffect } from "react";
import "./SnakeGame.css";

const foodColors = ["#ff0000", "#0000ff", "#008000", "#808080", "#ffa500", "#800080"];
const fakeColors = ["#f08080", "#fafad2", "#87cefa", "#98fb98", "#d8bfd8"]; // si besoin ultérieurement

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const tickDuration = 100; // durée d'un tick pour le compte à rebours (en ms)

  // Etat pour savoir si le jeu est lancé (appui sur espace)
  const [started, setStarted] = useState(false);

  // Taille de la grille (blockSize)
  const [gridSize, setGridSize] = useState(20);
  const minGridSize = 10;
  const maxGridSize = 40;

  // Contrôle d'affichage du panneau d'options
  const [showOptions, setShowOptions] = useState(false);

  // Zone de jeu fixe
  const canvasWidth = 800;
  const canvasHeight = 600;
  const columns = Math.floor(canvasWidth / gridSize);
  const rows = Math.floor(canvasHeight / gridSize);

  // Temps de référence pour le compte à rebours
  const referenceTime = (columns + rows - 2) * tickDuration;
  const [countdown, setCountdown] = useState(referenceTime);

  // Chronomètre (en secondes)
  const [timer, setTimer] = useState(0);

  // Initialiser le serpent : 5 segments noirs, centrés horizontalement, près du bas
  const initialSnake = () => {
    const snakeLength = 5;
    const startX = Math.floor((columns - snakeLength) / 2);
    const startY = rows - 3;
    const snakeArr = [];
    for (let i = 0; i < snakeLength; i++) {
      snakeArr.push({ x: startX + i, y: startY, color: "#000" });
    }
    return snakeArr;
  };

  const [snake, setSnake] = useState(initialSnake());
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState(generateFood(initialSnake()));
  const [gameOver, setGameOver] = useState(false);

  // Générer la nourriture dans un emplacement aléatoire non occupé par le serpent
  function generateFood(snakeArray) {
    let newFood;
    while (true) {
      const x = Math.floor(Math.random() * columns);
      const y = Math.floor(Math.random() * rows);
      const collision = snakeArray.some(segment => segment.x === x && segment.y === y);
      if (!collision) {
        const randomColor = foodColors[Math.floor(Math.random() * foodColors.length)];
        newFood = { x, y, color: randomColor };
        break;
      }
    }
    return newFood;
  }

  // Réinitialiser le jeu
  const initializeGame = () => {
    setSnake(initialSnake());
    setFood(generateFood(initialSnake()));
    setDirection("RIGHT");
    setGameOver(false);
    setTimer(0);
    setCountdown(referenceTime);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize, referenceTime]);

  // Écouteur de touches pour démarrer le jeu et pour contrôler le serpent
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si le jeu n'est pas démarré, appuyer sur espace démarre le jeu
      if (!started) {
        if (e.key === " " || e.key === "Spacebar") {
          setStarted(true);
        }
        return; // ne traite pas d'autres touches avant le démarrage
      }
      // Si le jeu a démarré, gérer le mouvement
      const key = e.key.toLowerCase();
      if (key === "z" && direction !== "DOWN") setDirection("UP");
      else if (key === "q" && direction !== "RIGHT") setDirection("LEFT");
      else if (key === "s" && direction !== "UP") setDirection("DOWN");
      else if (key === "d" && direction !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, direction]);

  // Chronomètre (timer) : s'incrémente chaque seconde tant que le jeu est lancé et non terminé
  useEffect(() => {
    if (!started || gameOver) return;
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [started, gameOver]);

  // Compte à rebours : se décrémente toutes les 100ms
  useEffect(() => {
    if (!started || gameOver) return;
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev - tickDuration <= 0) {
          // Si le compte atteint zéro, le serpent perd un segment
          setSnake(snake => {
            if (snake.length > 1) {
              return snake.slice(1);
            } else {
              setGameOver(true);
              return snake;
            }
          });
          return referenceTime;
        }
        return prev - tickDuration;
      });
    }, tickDuration);
    return () => clearInterval(countdownInterval);
  }, [started, gameOver, tickDuration, referenceTime]);

  // Boucle de jeu : mise à jour du serpent (seulement si le jeu est démarré)
  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[newSnake.length - 1] };

        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Collision avec les bords
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
          setGameOver(true);
          return prevSnake;
        }

        // Collision avec le corps
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const ateFood = head.x === food.x && head.y === food.y;
        if (ateFood) {
          // Le serpent grandit d'un segment (tout en restant noir)
          head.color = "#000";
          newSnake.push(head);
          setFood(generateFood(newSnake));
          setCountdown(referenceTime); // Réinitialiser le compte à rebours
        } else {
          newSnake.push(head);
          newSnake.shift();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [started, direction, food, gameOver, columns, rows, referenceTime]);

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Si le jeu n'est pas démarré, afficher un message
      if (!started && !gameOver) {
        ctx.fillStyle = "#333";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Appuyez sur Espace pour commencer", canvasWidth / 2, canvasHeight / 2);
        requestAnimationFrame(render);
        return;
      }

      // Dessiner la nourriture sous forme de cercle
      ctx.beginPath();
      ctx.fillStyle = food.color;
      const centerX = food.x * gridSize + gridSize / 2;
      const centerY = food.y * gridSize + gridSize / 2;
      ctx.arc(centerX, centerY, gridSize / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Dessiner le serpent (chaque segment avec coins arrondis)
      snake.forEach(segment => {
        ctx.fillStyle = "#000"; // Le serpent reste toujours noir
        drawRoundedRect(ctx, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize, 4);
      });

      // Afficher le compte à rebours
      ctx.fillStyle = "#000";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Countdown: ${Math.floor(countdown/1000)}s`, 10, 20);

      if (!gameOver) {
        requestAnimationFrame(render);
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
      }
    };

    render();
  }, [snake, food, gameOver, gridSize, countdown, started]);

  // Fonction de dessin d'un rectangle arrondi
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
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
  };

  const score = snake.length - 5;

  // Pop-up modal de Game Over
  const handleReplay = () => {
    initializeGame();
    setStarted(false); // Revenir à l'état non démarré pour nécessiter l'appui sur espace
  };

  const handleQuit = () => {
    window.location.reload();
  };

  return (
    <div className="snake-game-container">
      <div className="snake-menu">
        <div className="menu-item">Points: {score}</div>
        <div className="menu-item">Chrono: {timer}s</div>
        <div className="menu-item options" onClick={() => setShowOptions(prev => !prev)}>
          Options
        </div>
      </div>
      {showOptions && (
        <div className="snake-options">
          <label htmlFor="gridSize">Taille de la grille: {gridSize}px</label>
          <input
            id="gridSize"
            type="range"
            min={minGridSize}
            max={maxGridSize}
            value={gridSize}
            onChange={(e) => { setGridSize(Number(e.target.value)); setShowOptions(false); }}
          />
        </div>
      )}
      <div className="snake-canvas-container">
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
      {gameOver && (
        <div className="gameover-modal">
          <div className="gameover-popup">
            <h2>Game Over</h2>
            <div className="gameover-buttons">
              <button onClick={handleQuit}>Quitter</button>
              <button onClick={handleReplay}>Rejouer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
