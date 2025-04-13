import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Games from '../pages/Games';

// On mocke les composants pour isoler les tests
jest.mock('../components/SnakeGame', () => {
  return function DummySnakeGame(props) {
    return (
      <div data-testid="snake-game">
        SnakeGame Component
        <button onClick={props.onQuit}>Quit</button>
      </div>
    );
  };
});

jest.mock('../components/Scene3D.jsx', () => {
  return function DummyScene3D() {
    return <div data-testid="scene3d">Scene3D Component</div>;
  };
});

jest.mock('../components/GameLine', () => {
  return function DummySeparatorLine() {
    return <div data-testid="separator-line">SeparatorLine Component</div>;
  };
});

jest.mock('../components/RandomCirclesBackground', () => {
  return function DummyRandomCirclesBackground() {
    return <div data-testid="random-background">RandomCirclesBackground Component</div>;
  };
});

describe('Page Games', () => {
  test('affiche la liste initiale des démos avec les deux cartes de jeu', () => {
    render(<Games />);
    // Vérifier que le titre "Mes démos" est présent
    expect(screen.getByText(/Mes démos/i)).toBeInTheDocument();
    // Vérifier la présence des deux cartes
    expect(screen.getByText(/Neon Snake/i)).toBeInTheDocument();
    expect(screen.getByText(/Iut 3D/i)).toBeInTheDocument();
    // Vérifier que les boutons "Jouer" et "Explorer" existent
    expect(screen.getByText(/Jouer/i)).toBeInTheDocument();
    expect(screen.getByText(/Explorer/i)).toBeInTheDocument();
    // Vérifier que les composants d'arrière-plan sont affichés
    expect(screen.getByTestId('random-background')).toBeInTheDocument();
    expect(screen.getByTestId('separator-line')).toBeInTheDocument();
  });

  test('ouvre la vue de SnakeGame lorsque l\'on clique sur la carte "Neon Snake" et permet de revenir', () => {
    render(<Games />);
    // Cliquer sur la carte "Neon Snake"
    fireEvent.click(screen.getByText(/Neon Snake/i));
    // Vérifier que le bouton "Retour" apparaît
    expect(screen.getByText(/Retour/i)).toBeInTheDocument();
    // Vérifier que le composant SnakeGame est affiché
    expect(screen.getByTestId('snake-game')).toBeInTheDocument();
    // Cliquer sur "Retour" pour revenir à la liste
    fireEvent.click(screen.getByText(/Retour/i));
    // Vérifier que la liste des démos est de nouveau visible
    expect(screen.getByText(/Mes démos/i)).toBeInTheDocument();
    // Le composant SnakeGame ne doit plus être affiché
    expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
  });

  test('ouvre la vue de Scene3D lorsque l\'on clique sur la carte "Iut 3D" et permet de revenir', () => {
    render(<Games />);
    // Cliquer sur la carte "Iut 3D"
    fireEvent.click(screen.getByText(/Iut 3D/i));
    // Vérifier que le bouton "Retour" apparaît
    expect(screen.getByText(/Retour/i)).toBeInTheDocument();
    // Vérifier que le composant Scene3D est affiché
    expect(screen.getByTestId('scene3d')).toBeInTheDocument();
    // Cliquer sur "Retour" pour revenir à la liste
    fireEvent.click(screen.getByText(/Retour/i));
    // Vérifier que la liste des démos est de nouveau visible
    expect(screen.getByText(/Mes démos/i)).toBeInTheDocument();
    // Le composant Scene3D ne doit plus être affiché
    expect(screen.queryByTestId('scene3d')).not.toBeInTheDocument();
  });
});
