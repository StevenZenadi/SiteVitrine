// src/components/SnakeGame.jsx
import React, { useRef, useState, useEffect } from "react";

// Définition des couleurs possibles pour la nourriture
const foodColors = ["#ff0000", "#0000ff", "#008000", "#808080", "#ffa500", "#800080"];

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const blockSize = 20;
  
  // Dimensions du canvas (on utilise la taille de la fenêtre pour l'instant)
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const columns = Math.floor(canvasWidth / blockSize);
  const rows = Math.floor(canvasHeight / blockSize);
  
  // Initialise le serpent : 5 segments noirs, centrés horizontalement, près du bas
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

  // Génère un objet nourriture aléatoire dans la grille, avec couleur aléatoire, sans collision avec le serpent
  function generateFood(snakeArray) {
    let newFood;
    while (true) {
      const x = Math.floor(Math.random() * columns);
      const y = Math.floor(Math.random() * rows);
      const collision = snakeArray.some(segment => segment.x === x && segment.y === y);
      if (!collision) {
        // Choisir une couleur aléatoire dans foodColors
        const randomColor = foodColors[Math.floor(Math.random() * foodColors.length)];
        newFood = { x, y, color: randomColor };
        break;
      }
    }
    return newFood;
  }

  // Gestion des touches Z Q S D
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "z" && direction !== "DOWN") {
        setDirection("UP");
      } else if (key === "q" && direction !== "RIGHT") {
        setDirection("LEFT");
      } else if (key === "s" && direction !== "UP") {
        setDirection("DOWN");
      } else if (key === "d" && direction !== "LEFT") {
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Boucle principale du jeu (mise à jour du serpent)
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        // La tête actuelle est le dernier segment
        const head = { ...newSnake[newSnake.length - 1] };

        // Mise à jour de la tête selon la direction
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Vérification de la collision avec les bords (le collider)
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
          setGameOver(true);
          return prevSnake;
        }

        // Vérification de la collision avec le corps du serpent
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        let ateFood = head.x === food.x && head.y === food.y;
        
        // Si le serpent mange la nourriture
        if (ateFood) {
          // La nouvelle tête prend la couleur de la nourriture
          head.color = food.color;
          newSnake.push(head);
          // Générer une nouvelle nourriture avec une couleur aléatoire
          setFood(generateFood(newSnake));
        } else {
          // Déplacement normal : on retire le premier segment
          newSnake.push(head);
          newSnake.shift();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, columns, rows]);

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    const render = () => {
      // Fond de la zone de jeu
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Dessiner la nourriture sous forme de cercle
      ctx.beginPath();
      ctx.fillStyle = food.color;
      const centerX = food.x * blockSize + blockSize / 2;
      const centerY = food.y * blockSize + blockSize / 2;
      ctx.arc(centerX, centerY, blockSize / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Dessiner le serpent : chaque segment comme un carré
      snake.forEach(segment => {
        ctx.fillStyle = segment.color;
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
      });

      if (!gameOver) {
        requestAnimationFrame(render);
      } else {
        // Afficher "Game Over"
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
      }
    };

    render();
  }, [snake, food, gameOver]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default SnakeGame;
