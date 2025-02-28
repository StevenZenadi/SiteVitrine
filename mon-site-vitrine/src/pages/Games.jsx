import React, { useState } from 'react';
import './Games.css';
import SnakeGame from '../components/SnakeGame';
import SeparatorLine from '../components/GameLine';

function Games() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="games-page">
      <SeparatorLine />
      {!showGame ? (
        <div className="games-list">
          <h1>Mes Jeux Web</h1>
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
        </div>
      ) : (
        <div className="game-container">
          <SnakeGame onQuit={() => setShowGame(false)} />
        </div>
      )}
    </div>
  );
}

export default Games;
