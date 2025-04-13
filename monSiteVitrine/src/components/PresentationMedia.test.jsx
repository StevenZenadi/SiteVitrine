import React from 'react';
import { render, screen } from '@testing-library/react';
import PresentationMedia from '../components/PresentationMedia';

describe('PresentationMedia Component', () => {
  test('affiche bien la vidéo avec les attributs attendus', () => {
    const { container } = render(<PresentationMedia />);
    
    // Vérifier que l'élément <video> est présent
    const videoElement = container.querySelector('video');
    expect(videoElement).toBeInTheDocument();
    
    // Vérifier que l'attribut controls est présent
    expect(videoElement).toHaveAttribute('controls');
    
    // Vérifier que l'attribut width est bien défini à "100%"
    expect(videoElement.getAttribute('width')).toBe('100%');
    
    // Vérifier que l'attribut poster est bien défini
    expect(videoElement).toHaveAttribute('poster', '/images/video-poster.jpg');
    
    // Vérifier que l'élément <source> est présent avec les bons attributs
    const sourceElement = container.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', '/videos/presentation.mp4');
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });

  test('affiche la description de la vidéo', () => {
    render(<PresentationMedia />);
    expect(
      screen.getByText("Découvrez ma présentation personnelle dans cette courte vidéo.")
    ).toBeInTheDocument();
  });
});
