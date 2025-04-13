import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DynamicLogo from '../components/DynamicLogo';

describe('DynamicLogo Component', () => {
  test('rend un élément SVG contenant 6 cercles', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicLogo />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Vérifie qu'il y a 6 éléments <circle> (les cercles)
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(6);
  });

  test('pour la route "/projets", rend le bon nombre de lignes avec strokeWidth de 3', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/projets"]}>
        <DynamicLogo />
      </MemoryRouter>
    );
    // Pour "/projets", les connexions sont définies comme :
    // [0,1], [0,3], [3,2], [2,1], [2,5] soit 5 lignes
    await waitFor(() => {
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBe(5);
      lines.forEach(line => {
        // Sur cette route, strokeWidth doit être 3
        expect(line.getAttribute('stroke-width')).toBe('3');
      });
    });
  });

  test('pour la route "/about", rend le bon nombre de lignes avec strokeWidth de 2', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <DynamicLogo />
      </MemoryRouter>
    );
    // Pour "/about", les connexions sont définies comme :
    // [5,2], [2,1], [1,0], [0,3], [3,4], [3,2] soit 6 lignes
    await waitFor(() => {
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBe(6);
      lines.forEach(line => {
        // Sur cette route, strokeWidth doit être 2
        expect(line.getAttribute('stroke-width')).toBe('2');
      });
    });
  });

  test('pour une route non spécifiée, rend par défaut des connexions consécutives avec strokeWidth de 2', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/random"]}>
        <DynamicLogo />
      </MemoryRouter>
    );
    // Dans le cas "else", on boucle sur finalPositions (longueur = 6)
    // et on crée des connexions entre chaque paire consécutive : 5 lignes attendues.
    await waitFor(() => {
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBe(5);
      lines.forEach(line => {
        expect(line.getAttribute('stroke-width')).toBe('2');
      });
    });
  });
});
