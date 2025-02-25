// src/components/SnakeGame.jsx
import React, { useRef, useState, useEffect } from "react";
import "./SnakeGame.css";

// Couleurs pour la vraie nourriture
const foodColors = ["#ff0000", "#0000ff", "#008000", "#808080", "#ffa500", "#800080"];
// Couleurs pour les fake objects (palette pastel, différente des foodColors et trapColors)
const fakeColors = ["#f08080", "#fafad2", "#87cefa", "#98fb98", "#d8bfd8"];

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const tickDuration = 100; // durée d'un tick pour le compte à rebours (en ms)

  // Taille de la grille (taille d'un bloc)
  const [gridSize, setGridSize] = useState(20);
  const minGridSize = 10;
  const maxGridSize = 40;

  // Contrôle d'affichage du panneau d'options
  const [showOptions, setShowOptions] = useState(false);

  // Zone de jeu fixe (dimensions du canvas)
  const canvasWidth = 800;
  const canvasHeight = 600;
  const columns = Math.floor(canvasWidth / gridSize);
  const rows = Math.floor(canvasHeight / gridSize);

  // Temps de référence pour le compte à rebours : temps maximum que le serpent mettrait à parcourir la distance maximale
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

  // Fonction pour générer la vraie nourriture
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

  // Fonction pour générer un fake object (à des fins de distraction)
  function generateFake(snakeArray, foodObj) {
    let newFake;
    while (true) {
      const x = Math.floor(Math.random() * columns);
      const y = Math.floor(Math.random() * rows);
      // Éviter la collision avec le serpent ET la vraie nourriture
      const collision = snakeArray.some(segment => segment.x === x && segment.y === y)
                     || (foodObj && foodObj.x === x && foodObj.y === y);
      if (!collision) {
        const randomColor = fakeColors[Math.floor(Math.random() * fakeColors.length)];
        newFake = { x, y, color: randomColor };
        break;
      }
    }
    return newFake;
  }

  // États du jeu
  const [snake, setSnake] = useState(initialSnake());
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState(generateFood(initialSnake()));
  const [fake, setFake] = useState(generateFake(initialSnake(), food));
  const [gameOver, setGameOver] = useState(false);

  // Réinitialiser le jeu (lors du changement de grille ou pour rejouer)
  const initializeGame = () => {
    const initSnake = initialSnake();
    setSnake(initSnake);
    const newFood = generateFood(initSnake);
    setFood(newFood);
    setFake(generateFake(initSnake, newFood));
    setDirection("RIGHT");
    setGameOver(false);
    setTimer(0);
    setCountdown(referenceTime);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize, referenceTime]);

  // Chronomètre (timer) s'incrémente chaque seconde tant que le jeu n'est pas terminé
  useEffect(() => {
    if (gameOver) return;
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [gameOver]);

  // Compte à rebours : se décrémente toutes les 100ms. S'il atteint zéro, le serpent perd un segment.
  useEffect(() => {
    if (gameOver) return;
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev - tickDuration <= 0) {
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
  }, [gameOver, tickDuration, referenceTime]);

  // Contrôle du serpent avec Z, Q, S, D
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "z" && direction !== "DOWN") setDirection("UP");
      else if (key === "q" && direction !== "RIGHT") setDirection("LEFT");
      else if (key === "s" && direction !== "UP") setDirection("DOWN");
      else if (key === "d" && direction !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Boucle de jeu : mise à jour du serpent
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[newSnake.length - 1] };

        // Mise à jour de la tête selon la direction
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
        const ateFake = head.x === fake.x && head.y === fake.y;

        if (ateFood) {
          // Grandir : ajouter la tête sans retirer la queue
          head.color = "#000"; // Le serpent reste toujours noir
          newSnake.push(head);
          setFood(generateFood(newSnake));
          setFake(generateFake(newSnake, food)); // Régénérer le fake objet
          setCountdown(referenceTime);
        } else if (ateFake) {
          // Pénalité : perdre un segment (si possible)
          if (newSnake.length > 1) {
            newSnake.push(head);
            // Retirer deux segments : le comportement de perte de taille
            newSnake.shift();
            newSnake.shift();
          } else {
            setGameOver(true);
            return prevSnake;
          }
          setFake(generateFake(newSnake, food));
        } else {
          newSnake.push(head);
          newSnake.shift();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [direction, food, fake, gameOver, columns, rows, referenceTime]);

  // Fonction pour dessiner un rectangle arrondi
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

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Dessiner la vraie nourriture en cercle
      ctx.beginPath();
      ctx.fillStyle = food.color;
      const centerX = food.x * gridSize + gridSize / 2;
      const centerY = food.y * gridSize + gridSize / 2;
      ctx.arc(centerX, centerY, gridSize / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Dessiner le fake objet sous forme de carré arrondi
      ctx.fillStyle = fake.color;
      drawRoundedRect(ctx, fake.x * gridSize, fake.y * gridSize, gridSize, gridSize, 4);

      // Dessiner le serpent (chaque segment en carré arrondi)
      snake.forEach(segment => {
        ctx.fillStyle = "#000";
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
  }, [snake, food, fake, gameOver, gridSize, countdown]);

  const score = snake.length - 5;

  // Pop-up de fin de jeu
  const handleReplay = () => {
    initializeGame();
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
