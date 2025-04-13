import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LogoAnimated from '../components/LogoAnimated';
import { MemoryRouter } from 'react-router-dom';

// On mocke le composant WordIm pour éviter de dépendre de son implémentation
jest.mock('./WordIm', () => () => <div data-testid="word-im">WordIm</div>);

describe('LogoAnimated Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // On fixe des dimensions de fenêtre pour avoir des calculs prévisibles
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('rend 6 éléments "parallax-ball" et le composant WordIm', () => {
    const { container } = render(
      <MemoryRouter>
        <LogoAnimated />
      </MemoryRouter>
    );
    const balls = container.querySelectorAll('.parallax-ball');
    expect(balls.length).toBe(6);
    expect(screen.getByTestId('word-im')).toBeInTheDocument();
  });

  test('met à jour la position des balles lors d\'un déplacement de souris', () => {
    const { container } = render(
      <MemoryRouter>
        <LogoAnimated />
      </MemoryRouter>
    );
    // Au départ, aucune translation n'est appliquée (mouseOffset = {0, 0})
    const firstBall = container.querySelector('.parallax-ball');
    expect(firstBall.style.transform).toBe('translate(0px, 0px)');

    // Simuler un mouvement de souris.
    // Pour une fenêtre de 800x600, la formule est :
    // offsetX = (clientX - 400)/40 et offsetY = (clientY - 300)/40.
    // Par exemple, avec clientX = 440 et clientY = 320, on obtient offsetX = 1 et offsetY = 0.5.
    act(() => {
      fireEvent.mouseMove(window, { clientX: 440, clientY: 320 });
    });

    // Vérifier que le style "transform" du premier élément est bien mis à jour
    const updatedBall = container.querySelector('.parallax-ball');
    expect(updatedBall.style.transform).toBe('translate(1px, 0.5px)');
  });

  test('déclenche l\'animation de rebond en cas d\'inactivité (idle)', () => {
    const { container } = render(
      <MemoryRouter>
        <LogoAnimated />
      </MemoryRouter>
    );

    // Au départ, aucune balle ne doit avoir de propriété "animation"
    let balls = container.querySelectorAll('.parallax-ball');
    balls.forEach((ball) => {
      expect(ball.style.animation).toBeFalsy();
    });

    // Simuler l'inactivité en avançant le temps de plus de 2000ms (déclenchement du mode idle)
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // La logique de rebond s'exécute toutes les 4000ms en mode idle.
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Maintenant, l'effet de rebond devrait être déclenché pour au moins une balle
    balls = container.querySelectorAll('.parallax-ball');
    const bouncingBalls = Array.from(balls).filter((ball) =>
      ball.style.animation.includes('ballEyeMovement')
    );
    expect(bouncingBalls.length).toBeGreaterThan(0);

    // Après 2000ms, le rebond se termine et le style d'animation disparaît.
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    balls = container.querySelectorAll('.parallax-ball');
    const bouncingAfterReset = Array.from(balls).filter((ball) =>
      ball.style.animation.includes('ballEyeMovement')
    );
    expect(bouncingAfterReset.length).toBe(0);
  });
});
