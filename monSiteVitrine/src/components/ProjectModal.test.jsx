import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectModal from '../components/ProjectModal';

// On mocke le composant ProjectGallery pour isoler le test du modal
jest.mock('../components/ProjectGallery', () => (props) => {
  return <div data-testid="project-gallery">Gallery with {props.media.length} items</div>;
});

describe('ProjectModal Component', () => {
  const project = {
    title: 'Test Project',
    description: 'This is a test project description.',
    images: ['img1.png', 'img2.png']
  };

  test('ne rend rien si aucune donnée de projet n’est fournie', () => {
    const { container } = render(<ProjectModal project={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('affiche les détails du projet (titre, description, galerie)', () => {
    render(<ProjectModal project={project} onClose={() => {}} />);
    
    // Vérifie la présence du titre et de la description
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description.')).toBeInTheDocument();
    
    // Vérifie que la galerie est affichée avec le bon nombre d’éléments
    expect(screen.getByTestId('project-gallery').textContent).toMatch(/Gallery with 2 items/);
  });

  test('appelle onClose lorsqu’on clique sur l’overlay', () => {
    const onCloseMock = jest.fn();
    render(<ProjectModal project={project} onClose={onCloseMock} />);
    
    // Sélectionner l’overlay (la div avec la classe "modal-overlay")
    const overlay = document.querySelector('.modal-overlay');
    fireEvent.click(overlay);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('n’appelle pas onClose lorsqu’on clique à l’intérieur du contenu modal', () => {
    const onCloseMock = jest.fn();
    render(<ProjectModal project={project} onClose={onCloseMock} />);
    
    // Sélectionner la div du contenu modal
    const modalContent = document.querySelector('.modal-content');
    fireEvent.click(modalContent);
    
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test('appelle onClose lorsqu’on clique sur le bouton de fermeture', () => {
    const onCloseMock = jest.fn();
    render(<ProjectModal project={project} onClose={onCloseMock} />);
    
    // Sélectionner le bouton de fermeture (affichant "X")
    const closeButton = screen.getByText('X');
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
