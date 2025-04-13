import React from 'react';
import { render, screen } from '@testing-library/react';
import AnecdotesQuotes from '../components/AnecdotesQuotes';

describe('AnecdotesQuotes Component', () => {
  test('affiche le texte de la citation et le nom de l\'auteur', () => {
    render(<AnecdotesQuotes />);
    const quoteText = "La connaissance naît de la passion, tout autre éléments ne sont que catalyseurs ou inhibiteurs. La passion est inée.";
    
    // Le texte de la citation est affiché entre guillemets
    expect(screen.getByText(`"${quoteText}"`)).toBeInTheDocument();
    // Le nom de l'auteur doit être affiché dans le footer
    expect(screen.getByText(/- Steven/i)).toBeInTheDocument();
  });
});
