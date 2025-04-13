import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SnakeGame from '../components/SnakeGame';

// Les tests portent principalement sur l'interface (canvas, overlay d'aide, barre d'interface)
describe('SnakeGame Component', () => {
  test('affiche le canvas, la barre d\'interface et l\'overlay d\'aide au démarrage', () => {
    render(<SnakeGame />);
    
    // Vérifie que le canvas est présent
    const canvas = document.querySelector('.game-canvas');
    expect(canvas).toBeInTheDocument();
    
    // Vérifie que la barre d'interface est présente (affichage des stats du jeu)
    expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    expect(screen.getByText(/Countdown:/i)).toBeInTheDocument();
    expect(screen.getByText(/Points:/i)).toBeInTheDocument();
    
    // Vérifie que l'overlay d'aide est affiché au démarrage
    expect(screen.getByText(/Bienvenue dans Neon Snake/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrôlez le serpent en glissant sur l'écran/i)).toBeInTheDocument();
    
    // Vérifie la présence du bouton "Play"
    const playButton = screen.getByText(/Play/i);
    expect(playButton).toBeInTheDocument();
  });
  
  test('cache l\'overlay d\'aide lorsqu\'on clique sur le bouton "Play"', () => {
    render(<SnakeGame />);
    
    // On s'assure que l'overlay d'aide est affiché
    expect(screen.getByText(/Bienvenue dans Neon Snake/i)).toBeInTheDocument();
    
    // Simuler un clic sur le bouton "Play"
    const playButton = screen.getByText(/Play/i);
    fireEvent.click(playButton);
    
    // Après le clic, l'overlay d'aide ne doit plus être présent
    expect(screen.queryByText(/Bienvenue dans Neon Snake/i)).not.toBeInTheDocument();
  });
  
  // NOTE : Tester la boucle de jeu ou le comportement "Game Over" nécessiterait de simuler
  // plusieurs mises à jour de la logique interne et n'est pas trivial dans le cadre d'un test unitaire.
});
