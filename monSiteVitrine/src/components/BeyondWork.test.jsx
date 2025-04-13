import React from 'react';
import { render, screen } from '@testing-library/react';
import BeyondWork from '../components/BeyondWork';

describe('Composant BeyondWork', () => {
  test('affiche le contenu textuel', () => {
    render(<BeyondWork />);
    // Vérifie qu'une partie du texte est bien affichée
    expect(
      screen.getByText(/En dehors du travail, je me passionne pour de nombreux domaines/i)
    ).toBeInTheDocument();
  });
});
