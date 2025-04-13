import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TiltCard from '../components/TiltCard';

describe('TiltCard Component', () => {
  test('applique la transformation lors du déplacement de la souris', () => {
    const { container, getByText } = render(
      <TiltCard>
        <div>Contenu de test</div>
      </TiltCard>
    );

    const card = container.firstChild;
    
    // On mocke getBoundingClientRect pour obtenir des valeurs prédictibles
    card.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
    });

    // Simuler un mouvement de souris
    // Avec clientX = 150 et clientY = 150, on obtient :
    // x = 150 - 100 = 50, y = 150 - 100 = 50
    // centerX = 100, centerY = 100
    // deltaX = (50 - 100) / 100 = -0.5  et  deltaY = (50 - 100) / 100 = -0.5
    // Transformation attendue : "perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.03)"
    fireEvent.mouseMove(card, { clientX: 150, clientY: 150 });
    
    expect(card.style.transform).toBe(
      'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.03)'
    );
  });

  test('réinitialise la transformation lors du départ de la souris', () => {
    const { container } = render(
      <TiltCard>
        <div>Contenu de test</div>
      </TiltCard>
    );
    const card = container.firstChild;

    // On définit une transformation initiale pour simuler un état modifié
    card.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.03)';

    // Simuler l'événement mouseleave
    fireEvent.mouseLeave(card);

    // Transformation réinitialisée attendue
    expect(card.style.transform).toBe(
      'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
    );
  });
});
