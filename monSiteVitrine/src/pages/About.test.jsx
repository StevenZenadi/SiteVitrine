import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../pages/About';

// On mocke les composants imbriqués pour se concentrer sur le rendu de la page About
jest.mock('../components/PersonalProjects', () => () => (
  <div data-testid="photo-gallery">PhotoGallery Component</div>
));
jest.mock('../components/Timeline', () => () => (
  <div data-testid="timeline">Timeline Component</div>
));
jest.mock('../components/BeyondWork', () => () => (
  <div data-testid="beyond-work">BeyondWork Component</div>
));
jest.mock('../components/AnecdotesQuotes', () => () => (
  <div data-testid="anecdotes-quotes">AnecdotesQuotes Component</div>
));

describe('Page About', () => {
  test('affiche le titre, le sous-titre et l’image de profil', () => {
    render(<About />);
    // Vérifie la présence du titre principal
    expect(
      screen.getByRole('heading', { name: /À Propos de Moi/i })
    ).toBeInTheDocument();
    // Vérifie la présence du sous-titre
    expect(
      screen.getByRole('heading', { name: /Ingénieur Full-Stack & IoT Passionné/i })
    ).toBeInTheDocument();
    // Vérifie la présence de l'image de profil
    expect(screen.getByAltText(/Mon profil/i)).toBeInTheDocument();
  });

  test('affiche le paragraphe de présentation', () => {
    render(<About />);
    // Vérifie qu'une partie du texte de présentation est bien affichée
    expect(
      screen.getByText(/Je m'appelle Steven Zenadi/i)
    ).toBeInTheDocument();
  });

  test('affiche les sections avec leurs composants associés', () => {
    render(<About />);
    // Section "Projets persos"
    expect(
      screen.getByRole('heading', { name: /Projets persos/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('photo-gallery')).toBeInTheDocument();
    
    // Section "Ma Timeline"
    expect(
      screen.getByRole('heading', { name: /Ma Timeline/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    
    // Section "Au-delà du travail"
    expect(
      screen.getByRole('heading', { name: /Au-delà du travail/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('beyond-work')).toBeInTheDocument();
    
    // Section "Anecdotes & Citations"
    expect(
      screen.getByRole('heading', { name: /Anecdotes & Citations/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('anecdotes-quotes')).toBeInTheDocument();
  });

  test('affiche le lien de téléchargement du CV avec l’attribut download', () => {
    render(<About />);
    const downloadLink = screen.getByRole('link', { name: /Télécharger mon CV/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('download');
    // Vérifie que le href contient bien une référence au CV (peut être adapté selon le chemin réel)
    expect(downloadLink.getAttribute('href')).toContain('cv');
  });
});
