// src/pages/Jeux.jsx
import React, { useState } from 'react';
import "./Games.css";

function Jeux() {
  // Exemple de données pour les jeux
  const [games] = useState([
    {
      id: 1,
      title: "Jeu de Puzzle",
      description: "Un puzzle interactif pour stimuler votre esprit.",
      image: "/images/game-puzzle.jpg",
      link: "https://exemple.com/game-puzzle"
    },
    {
      id: 2,
      title: "Jeu d'Arcade",
      description: "Revivez l'ambiance des salles d'arcade classiques.",
      image: "/images/game-arcade.jpg",
      link: "https://exemple.com/game-arcade"
    },
    {
      id: 3,
      title: "Jeu de Plateforme",
      description: "Parcourez des niveaux défiant la gravité et vos réflexes.",
      image: "/images/game-platform.jpg",
      link: "https://exemple.com/game-platform"
    }
    // Ajoute d'autres jeux si besoin
  ]);

  return (
    <div className="jeux-page">
      <h1>Mes Jeux Web</h1>
      <p>Découvrez quelques jeux que j'ai réalisés pour démontrer mes compétences en développement web ludique.</p>
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <img src={game.image} alt={game.title} className="game-image" />
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <a href={game.link} target="_blank" rel="noopener noreferrer" className="btn">
              Jouer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jeux;
