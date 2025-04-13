import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonalProjects from '../components/PersonalProjects';

// On mocke le composant ProjectGallery pour isoler le test sur PersonalProjects.
// Ici, on affiche simplement le nombre d'éléments passés via la prop "media".
jest.mock('../components/ProjectGallery', () => (props) => {
  return <div data-testid="project-gallery">Gallery with {props.media.length} items</div>;
});

describe('PersonalProjects Component', () => {
  test('affiche bien les cartes de projets avec titre, galerie et description', () => {
    render(<PersonalProjects />);

    // Vérifie la présence des titres des projets
    expect(screen.getByText("Aménagement de mon Van")).toBeInTheDocument();
    expect(screen.getByText("Atelier DIY")).toBeInTheDocument();

    // Vérifie que les descriptions sont bien affichées (on peut tester sur une partie du texte)
    expect(
      screen.getByText(/Transformation complète d’un utilitaire en espace de vie personnalisé/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Creation d'un modèle personnalisé sur base de classe A 200/i)
    ).toBeInTheDocument();

    // Vérifie que deux galeries de projets sont rendues (une par projet)
    const galleries = screen.getAllByTestId('project-gallery');
    expect(galleries.length).toBe(2);

    // Vérifie que la première galerie contient 12 médias (images du van)
    expect(galleries[0].textContent).toMatch(/Gallery with 12 items/);
    
    // Vérifie que la seconde galerie contient 8 médias (pour le projet "Atelier DIY")
    expect(galleries[1].textContent).toMatch(/Gallery with 8 items/);
  });
});
