import React from 'react';
import { render } from '@testing-library/react';
import WordIm from '../components/WordIm';

describe('WordIm Component', () => {
  test('rend le conteneur principal avec la classe "word-im"', () => {
    const { container } = render(<WordIm />);
    const mainDiv = container.querySelector('.word-im');
    expect(mainDiv).toBeInTheDocument();
  });

  test('rend les éléments internes correctement', () => {
    const { container } = render(<WordIm />);
    
    // Vérifie le span avec classes "bar" et "i"
    const barI = container.querySelector('.bar.i');
    expect(barI).toBeInTheDocument();
    
    // Vérifie le span avec la classe "apostrophe"
    const apostrophe = container.querySelector('.apostrophe');
    expect(apostrophe).toBeInTheDocument();
    
    // Vérifie le conteneur "m-container"
    const mContainer = container.querySelector('.m-container');
    expect(mContainer).toBeInTheDocument();
    
    // Vérifie les trois spans avec les classes "bar m1", "bar m2" et "bar m3"
    const barM1 = container.querySelector('.bar.m1');
    const barM2 = container.querySelector('.bar.m2');
    const barM3 = container.querySelector('.bar.m3');
    expect(barM1).toBeInTheDocument();
    expect(barM2).toBeInTheDocument();
    expect(barM3).toBeInTheDocument();
  });
});
