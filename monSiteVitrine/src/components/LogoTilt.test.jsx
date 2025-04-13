import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoTilt from '../components/LogoTilt';

describe('LogoTilt Component', () => {
  test('applique la transformation lors du déplacement de la souris', () => {
    const { container, getByAltText } = render(
      <LogoTilt src="test.png" alt="Test Logo" />
    );
    const logoDiv = container.querySelector('.logo-tilt');
    
    // On mocke getBoundingClientRect pour avoir des valeurs prévisibles
    logoDiv.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
    });

    // Simuler un mouvement de souris sur le div
    // Par exemple, avec clientX = 150 et clientY = 150 :
    // - x = 150 - 100 = 50, y = 150 - 100 = 50
    // - centerX = 200/2 = 100, centerY = 100
    // => deltaX = (50 - 100) / 100 = -0.5 et deltaY = (50 - 100) / 100 = -0.5
    // La transformation attendue sera : 
    // "perspective(1000px) rotateX(-20deg) rotateY(20deg) scale(1.3)"
    fireEvent.mouseMove(logoDiv, { clientX: 150, clientY: 150 });
    
    expect(logoDiv.style.transform).toBe(
      'perspective(1000px) rotateX(-20deg) rotateY(20deg) scale(1.3)'
    );
  });

  test('réinitialise la transformation lors du départ de la souris', () => {
    const { container } = render(
      <LogoTilt src="test.png" alt="Test Logo" />
    );
    const logoDiv = container.querySelector('.logo-tilt');
    
    // Définir une transformation initiale
    logoDiv.style.transform = 'perspective(1000px) rotateX(-20deg) rotateY(20deg) scale(1.3)';
    
    // Simuler l'événement de sortie de souris
    fireEvent.mouseLeave(logoDiv);
    
    expect(logoDiv.style.transform).toBe(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    );
  });
});
