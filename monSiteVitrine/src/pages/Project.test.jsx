import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Projects from '../pages/Projects';
import { MemoryRouter } from 'react-router-dom';

// On mocke le composant ProjectModal pour ne pas dépendre de son implémentation
jest.mock('../components/ProjectModal', () => {
  return function DummyProjectModal({ project, onClose }) {
    return (
      <div data-testid="project-modal">
        <h2>{project.title}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('Page Projects', () => {
  test('affiche le titre "Mes Projets"', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mes Projets/i)).toBeInTheDocument();
  });

  test('affiche tous les onglets de catégories', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );
    expect(screen.getByText(/Tous/i)).toBeInTheDocument();
    expect(screen.getByText(/Développement Web/i)).toBeInTheDocument();
    expect(screen.getByText(/Modélisation 3D/i)).toBeInTheDocument();
    expect(screen.getByText(/Intégration 3D/i)).toBeInTheDocument();
    expect(screen.getByText(/Interfaces/i)).toBeInTheDocument();
    expect(screen.getByText(/Jeux & Démos/i)).toBeInTheDocument();
    expect(screen.getByText(/Autres Expériences/i)).toBeInTheDocument();
  });

  test('filtre les projets en fonction de la catégorie sélectionnée', async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    // Au départ, tous les projets sont affichés
    expect(screen.getByText(/Site Vitrine/i)).toBeInTheDocument();
    expect(screen.getByText(/Modélisation 3D/i)).toBeInTheDocument();
    expect(screen.getByText(/Jeu Snake Amélioré/i)).toBeInTheDocument();

    // On clique sur l'onglet "Développement Web"
    fireEvent.click(screen.getByText(/Développement Web/i));

    // On attend la fin de la transition (timeout de 300ms)
    await waitFor(() => {
      expect(screen.getByText(/Site Vitrine/i)).toBeInTheDocument();
    });

    // Seul le projet "Site Vitrine" doit être affiché pour cette catégorie
    expect(screen.queryByText(/Modélisation 3D/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jeu Snake Amélioré/i)).not.toBeInTheDocument();
  });

  test('ouvre et ferme la modal pour les catégories de type modal', async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    // On clique sur l'onglet "Modélisation 3D" (catégorie ouvrant une modal)
    fireEvent.click(screen.getByText(/Modélisation 3D/i));

    // Attendre la transition
    await waitFor(() => {
      expect(screen.getByText(/Modélisation 3D/i)).toBeInTheDocument();
    });

    // On clique sur le bouton "Voir le projet" pour ouvrir la modal
    const viewButtons = screen.getAllByText(/Voir le projet/i);
    expect(viewButtons.length).toBeGreaterThan(0);
    fireEvent.click(viewButtons[0]);

    // La modal doit apparaître
    const modal = await screen.findByTestId('project-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Modélisation 3D/i);

    // On ferme la modal en cliquant sur le bouton "Close"
    fireEvent.click(screen.getByText(/Close/i));
    await waitFor(() => {
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });
  });

  test('réinitialise la catégorie lors du clic sur "Voir tous les projets"', async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    // On filtre d'abord sur une catégorie spécifique
    fireEvent.click(screen.getByText(/Développement Web/i));
    await waitFor(() => {
      expect(screen.getByText(/Site Vitrine/i)).toBeInTheDocument();
    });

    // Le bouton "Voir tous les projets" apparaît
    fireEvent.click(screen.getByText(/Voir tous les projets/i));

    // Attendre que tous les projets soient de nouveau affichés
    await waitFor(() => {
      expect(screen.getByText(/Modélisation 3D/i)).toBeInTheDocument();
      expect(screen.getByText(/Jeu Snake Amélioré/i)).toBeInTheDocument();
    });
  });
});
