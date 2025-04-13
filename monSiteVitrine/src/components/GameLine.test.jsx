import React from 'react';
import { render, act } from '@testing-library/react';
import GameLine from '../components/GameLine';

describe('GameLine Component', () => {
  // On simule la méthode getTotalLength pour les éléments <path>
  beforeAll(() => {
    HTMLPathElement.prototype.getTotalLength = () => 600;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('rend un élément SVG avec un chemin et applique les styles d’animation', () => {
    const { container } = render(<GameLine />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    // Vérifie que la longueur du chemin a été appliquée aux styles
    expect(path.style.strokeDasharray).toBe('600');
    expect(path.style.strokeDashoffset).toBe('600');
  });

  test('génère des rolling balls au fil du temps', () => {
    const { container } = render(<GameLine />);
    // Au départ, aucune boule ne doit être affichée
    expect(container.querySelectorAll('.rolling-ball').length).toBe(0);

    // Avance le temps pour déclencher la génération des boules
    act(() => {
      jest.advanceTimersByTime(7000);
    });

    // On s'attend à ce qu'au moins une boule soit apparue
    const balls = container.querySelectorAll('.rolling-ball');
    expect(balls.length).toBeGreaterThan(0);
  });
});
