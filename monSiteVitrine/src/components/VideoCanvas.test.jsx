import React from 'react';
import { render, act } from '@testing-library/react';
import VideoCanvas from '../components/VideoCanvas';

describe('VideoCanvas Component', () => {
  let originalCreateElement;
  let mockVideo;

  beforeEach(() => {
    jest.useFakeTimers();
    // Sauvegarder la méthode originale
    originalCreateElement = document.createElement;
    // Créer un mock pour l'élément vidéo
    mockVideo = {
      play: jest.fn().mockResolvedValue(),
      currentTime: 0,
      ended: false,
      videoWidth: 640,
      videoHeight: 360,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    // On spy sur document.createElement pour retourner le mock quand "video" est demandé
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'video') {
        return mockVideo;
      }
      return originalCreateElement.call(document, tagName);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    document.createElement.mockRestore();
  });

  test('rend un canvas avec la largeur et la hauteur spécifiées', () => {
    const { container } = render(
      <VideoCanvas videoSources={[]} width={800} height={450} />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    // Les attributs width et height du canvas sont définis à partir des props
    expect(canvas.getAttribute('width')).toBe('800');
    expect(canvas.getAttribute('height')).toBe('450');
  });

  test('initialise la vidéo avec la première source et passe à la suivante selon la durée', () => {
    const videoSources = ['video1.mp4', 'video2.mp4'];
    render(
      <VideoCanvas videoSources={videoSources} duration={3000} width={800} height={450} />
    );
    // Au montage, l'effet qui charge la vidéo devrait définir le src sur la première source.
    expect(mockVideo.src).toBe('video1.mp4');

    // Simuler l'écoulement de 3000 ms pour déclencher le setInterval qui met à jour l'index.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Le setInterval met à jour currentIndex et recharge la vidéo.
    expect(mockVideo.src).toBe('video2.mp4');

    // Avancer encore de 3000 ms, le cycle revient à la première source.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockVideo.src).toBe('video1.mp4');
  });

  test('annule l\'animation frame lors du démontage', () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(
      <VideoCanvas videoSources={[]} width={800} height={450} />
    );
    unmount();
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    cancelAnimationFrameSpy.mockRestore();
  });
});
