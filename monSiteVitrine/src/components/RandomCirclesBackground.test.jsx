import React from 'react';
import { render, screen, act } from '@testing-library/react';
import RandomCirclesBackground from '../components/RandomCirclesBackground';

describe('RandomCirclesBackground Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  
  test('affiche 20 cercles avec la classe appropriée lors du montage', () => {
    const { container } = render(
      <RandomCirclesBackground selectedCategory="hardware" />
    );
    
    // Dès le montage, la génération initiale a lieu
    const circles = container.querySelectorAll('.circle');
    expect(circles.length).toBe(20);
    
    // Juste après le montage, le useEffect de transition s'exécute : on attend que le state "transitioning" soit true,
    // ce qui affecte la classe appliquée aux cercles.
    // Les cercles devraient donc avoir la classe "fade-out"
    circles.forEach(circle => {
      expect(circle.className).toMatch(/fade-out/);
    });
    
    // Avancer le temps de 600ms pour terminer la transition
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Après 600ms, transitioning devient false et les cercles devraient avoir la classe "fade-in"
    const updatedCircles = container.querySelectorAll('.circle');
    updatedCircles.forEach(circle => {
      expect(circle.className).toMatch(/fade-in/);
    });
  });
  
  test('met à jour la position des cercles lors d\'un déplacement de souris', () => {
    const { container } = render(
      <RandomCirclesBackground selectedCategory="apprentissage" />
    );
    
    // On simule un événement "mousemove" sur la fenêtre
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 600, // par exemple, au-delà du centre
        clientY: 400,
      }));
    });
    
    // Vérifier que le style "transform" de l'un des cercles est mis à jour
    // Comme le décalage mouseOffset est calculé par rapport à (window.innerWidth/2, window.innerHeight/2),
    // avec par exemple innerWidth=window.innerWidth et innerHeight=window.innerHeight,
    // on ne teste pas la valeur exacte mais on s'assure qu'il y a bien un "translate(" dans la propriété style.
    const circle = container.querySelector('.circle');
    expect(circle.style.transform).toMatch(/translate\(/);
  });
  
  test('génère de nouveaux cercles et déclenche une transition lors d\'un changement de catégorie', () => {
    const { container, rerender } = render(
      <RandomCirclesBackground selectedCategory="software" />
    );
    
    // On avance le temps pour terminer la transition initiale
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Récupère le premier rendu des cercles
    const circlesBefore = Array.from(container.querySelectorAll('.circle')).map(el => el.style.cssText);
    
    // Changement de catégorie (simulate new prop)
    rerender(<RandomCirclesBackground selectedCategory="hardware" />);
    
    // Lors du changement, transitioning est mis à true immédiatement, donc les cercles devraient avoir la classe fade-out
    let circlesAfter = container.querySelectorAll('.circle');
    circlesAfter.forEach(circle => {
      expect(circle.className).toMatch(/fade-out/);
    });
    
    // Après 600ms, la transition s'achève et de nouveaux cercles sont générés
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Vérifier que de nouveaux cercles ont été générés en comparant par exemple leur style inline
    const circlesAfterTransition = Array.from(container.querySelectorAll('.circle')).map(el => el.style.cssText);
    // On s'attend à ce que le style diffère de la première génération
    expect(circlesAfterTransition).not.toEqual(circlesBefore);
  });
});
