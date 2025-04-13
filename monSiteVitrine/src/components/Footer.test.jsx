import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import { MemoryRouter } from 'react-router-dom';

describe('Footer Component', () => {
  test('affiche le slogan et le copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Créé avec passion par Steven Zenadi/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/© 2025 Mon Site - Tous droits réservés/i)
    ).toBeInTheDocument();
  });

  test('affiche les liens vers LinkedIn et GitHub avec les bons attributs', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    // Vérification du lien LinkedIn
    expect(links[0]).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/steven-zenadi-885281150'
    );
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');

    // Vérification du lien GitHub
    expect(links[1]).toHaveAttribute(
      'href',
      'https://github.com/StevenZenadi/SiteVitrine'
    );
    expect(links[1]).toHaveAttribute('target', '_blank');
    expect(links[1]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
