import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import { MemoryRouter } from 'react-router-dom';

// On mocke les composants imbriqués pour isoler les tests de la page Home
jest.mock('../components/LogoAnimated', () => () => (
  <div data-testid="logo-animated">LogoAnimated</div>
));
jest.mock('../components/TestimonialsCarousel', () => () => (
  <div data-testid="testimonials-carousel">TestimonialsCarousel</div>
));

describe('Page Home', () => {
  test('affiche la section Hero avec les textes appropriés', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Bienvenue sur mon portfolio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ingénieur Full-Stack & IoT Passionné/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cette application React a pour but de vous présenter mon savoir-faire/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('logo-animated')).toBeInTheDocument();
  });

  test('affiche la section "Projets récents" avec les cartes de projets et le lien vers tous les projets', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Projets récents/i)).toBeInTheDocument();
    // Vérifie la présence d'une carte de projet "Portfolio"
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Création d’un portfolio moderne et responsive/i)
    ).toBeInTheDocument();

    // Vérifie le lien "Voir tous les projets"
    const allProjectsLink = screen.getByRole('link', {
      name: /Voir tous les projets/i,
    });
    expect(allProjectsLink).toBeInTheDocument();
    expect(allProjectsLink.getAttribute('href')).toBe('/projets');
  });

  test('affiche la section des témoignages', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Ce qu'ils disent de moi/i)).toBeInTheDocument();
    expect(screen.getByTestId('testimonials-carousel')).toBeInTheDocument();
  });

  test('affiche la section de contact avec le lien approprié', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Vous avez un projet en tête ?/i)).toBeInTheDocument();
    const contactLink = screen.getByRole('link', { name: /Contactez-moi/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.getAttribute('href')).toBe('/contact');
  });
});
