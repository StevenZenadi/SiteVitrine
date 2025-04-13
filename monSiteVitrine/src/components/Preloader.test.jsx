import React from 'react';
import { render, act } from '@testing-library/react';
import Preloader from '../components/Preloader';

describe('Preloader Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('affiche la vidéo, ajoute la classe fade-out et appelle onFinish après les délais', () => {
    const onFinishMock = jest.fn();
    const { container } = render(<Preloader onFinish={onFinishMock} />);
    
    // Vérifie que l'élément vidéo est présent
    const videoElement = container.querySelector('.preloader-video');
    expect(videoElement).toBeInTheDocument();
    
    // Vérifie qu'au départ, la div du preloader n'a pas la classe fade-out
    const preloaderDiv = container.querySelector('.preloader');
    expect(preloaderDiv.classList.contains('fade-out')).toBe(false);
    
    // Avancer le temps de 3000ms pour simuler la fin de la vidéo
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Après 3000ms, le preloader doit obtenir la classe "fade-out"
    expect(preloaderDiv.classList.contains('fade-out')).toBe(true);
    
    // Avancer de 500ms supplémentaires pour déclencher onFinish (total 3500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Vérifie que la fonction onFinish a bien été appelée
    expect(onFinishMock).toHaveBeenCalledTimes(1);
  });
});
