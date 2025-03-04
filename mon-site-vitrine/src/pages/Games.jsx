// src/pages/Games.jsx
import React, { useState } from 'react';
import './Games.css';
import SnakeGame from '../components/SnakeGame';
import Scene3D from '../components/Scene3D.jsx';
import SeparatorLine from '../components/GameLine';
import RandomCirclesBackground from "../components/RandomCirclesBackground";

function Games() {
  // "selectedGame" peut être "snake", "cv3d" ou null
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    if (selectedGame === "snake") {
      return (
        <div className="game-container">
          <button className="back-btn" onClick={() => setSelectedGame(null)}>
            Retour
          </button>
          <SnakeGame onQuit={() => setSelectedGame(null)} />
        </div>
      );
    } else if (selectedGame === "cv3d") {
      return (
        <div className="game-container">
          <button className="back-btn" onClick={() => setSelectedGame(null)}>
            Retour
          </button>
          <Scene3D />
        </div>
      );
    }
  };

  return (
    <div className="games-page">
      <RandomCirclesBackground/>

      <SeparatorLine />
      {selectedGame === null ? (
        <div className="games-list">
          <h1>Mes Jeux Web</h1>
          {/* Carte pour Neon Snake */}
          <div className="game-card" onClick={() => setSelectedGame("snake")}>
            <img
              src="/images/snake-thumbnail.webp"
              alt="Neon Snake"
              className="game-thumbnail"
              loading="lazy"
            />
            <h3>Neon Snake</h3>
            <p>
              Découvrez une version percutante du classique Snake avec des
              effets néon et animations modernes.
            </p>
            <button className="btn play-btn">Jouer</button>
          </div>
          {/* Nouvelle carte pour le CV 3D interactif */}
          <div className="game-card" onClick={() => setSelectedGame("cv3d")}>
            <img
              //src="/images/cv3d-thumbnail.webp"
              alt="CV 3D Interactif"
              className="game-thumbnail"
              loading="lazy"
            />
            <h3>CV 3D Interactif</h3>
            <p>
              Explorez mon CV sous un angle inédit grâce à une expérience 3D
              immersive et en réalité augmentée.
            </p>
            <button className="btn play-btn">Explorer</button>
          </div>
        </div>
      ) : (
        renderGame()
      )}
    </div>
  );
}

export default Games;
