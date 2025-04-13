import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectGallery from '../components/ProjectGallery';

describe('ProjectGallery Component', () => {
  const mediaItems = [
    // Première slide : objet image avec légende
    { src: 'image1.png', caption: 'Caption for image 1' },
    // Deuxième slide : objet vidéo avec légende et poster
    { type: 'video', src: 'video1.mp4', poster: 'poster1.jpg', caption: 'Caption for video' },
    // Troisième slide : chaîne de caractères (image)
    'image2.png'
  ];

  test('rend le bon nombre de slides en fonction de la prop "media"', () => {
    const { container } = render(<ProjectGallery media={mediaItems} />);
    const slides = container.querySelectorAll('.gallery-slide');
    expect(slides.length).toBe(mediaItems.length);
  });

  test('rend une slide image avec légende pour un objet media de type image', () => {
    render(<ProjectGallery media={[mediaItems[0]]} />);
    // Pour une slide image, on attend une balise <img> avec l'alt "Slide 1"
    const imgElement = screen.getByAltText('Slide 1');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'image1.png');
    // Vérification de la légende
    expect(screen.getByText('Caption for image 1')).toBeInTheDocument();
  });

  test('rend une slide vidéo avec légende pour un objet media de type video', () => {
    render(<ProjectGallery media={[mediaItems[1]]} />);
    // Pour une slide vidéo, on attend un élément <video>
    const videoElement = document.querySelector('video');
    expect(videoElement).toBeInTheDocument();
    // Vérifie le poster si fourni
    expect(videoElement).toHaveAttribute('poster', 'poster1.jpg');
    // Vérifie la présence de la légende
    expect(screen.getByText('Caption for video')).toBeInTheDocument();
  });

  test('rend une slide image quand le media est fourni sous forme de chaîne de caractères', () => {
    render(<ProjectGallery media={[mediaItems[2]]} />);
    const imgElement = screen.getByAltText('Slide 1'); // seule slide, donc index 1
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'image2.png');
  });
});
