import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CirclesConnections from '../components/CirclesConnections';

describe('CirclesConnections Component', () => {
  // Fonction utilitaire pour générer un tableau de cercles avec des positions (left, top)
  const generateCircles = (n) =>
    Array.from({ length: n }, (_, index) => ({
      left: (index + 1) * 10, // Exemple de valeur
      top: (index + 1) * 10,
    }));

  test('ne rend aucun ligne lorsque le nombre de cercles est insuffisant', async () => {
    // Si le nombre de cercles est inférieur à 5, Math.floor(circles.length / 5) = 0
    const circles = generateCircles(3);
    render(
      <CirclesConnections circles={circles} ballSize={20} transitioning={false} />
    );
    await waitFor(() => {
      const lines = document.querySelectorAll('line');
      expect(lines.length).toBe(0);
    });
  });

  test('rend le nombre de lignes attendu lorsque le nombre de cercles est suffisant', async () => {
    // Par exemple, avec 10 cercles, Math.floor(10 / 5) = 2 lignes attendues
    const circles = generateCircles(10);
    render(
      <CirclesConnections circles={circles} ballSize={20} transitioning={false} />
    );
    await waitFor(() => {
      const lines = document.querySelectorAll('line');
      expect(lines.length).toBe(Math.floor(circles.length / 5));
    });
  });

  test('les lignes ont la bonne opacité en fonction de la prop "transitioning"', async () => {
    const circles = generateCircles(10);
    const { rerender } = render(
      <CirclesConnections circles={circles} ballSize={20} transitioning={false} />
    );
    // Lorsque transitioning est false, l'opacité doit être 1
    await waitFor(() => {
      const lines = document.querySelectorAll('line');
      lines.forEach((line) => {
        expect(line.getAttribute('opacity')).toBe('1');
      });
    });
    // Rerender avec transitioning true et vérifier que l'opacité devient 0
    rerender(
      <CirclesConnections circles={circles} ballSize={20} transitioning={true} />
    );
    await waitFor(() => {
      const lines = document.querySelectorAll('line');
      lines.forEach((line) => {
        expect(line.getAttribute('opacity')).toBe('0');
      });
    });
  });
});
