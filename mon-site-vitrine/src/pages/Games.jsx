// src/pages/Games.jsx
import React, { useState } from 'react';
import './Games.css';
import SnakeGame from '../components/SnakeGame';


function Games() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="games-page">
      {!showGame ? (
        <div className="games-list">
          <h1>Mes Jeux Web</h1>
          {/* Carte pour le jeu Neon Snake */}
          <div className="game-card">
            <img 
              src="/images/snake-thumbnail.webp" 
              alt="Neon Snake" 
              className="game-thumbnail" 
              loading="lazy"
            />
            <h3>Neon Snake</h3>
            <p>Découvrez une version percutante du classique Snake avec des effets néon et animations modernes.</p>
            <button onClick={() => setShowGame(true)} className="btn play-btn">
              Jouer
            </button>
          </div>
          {/* Vous pouvez ajouter d'autres cartes de jeux ici */}
        </div>
      ) : (
        <div className="game-container">
          <button onClick={() => setShowGame(false)} className="btn back-btn">
            Retour
          </button>
          <SnakeGame />
        </div>
      )}
    </div>
  );
}

export default Games;
