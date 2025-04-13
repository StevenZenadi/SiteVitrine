import React from 'react';
import { render, screen } from '@testing-library/react';
import PageTransition from '../components/PageTransition';

describe('PageTransition Component', () => {
  test('rend correctement ses enfants', () => {
    render(
      <PageTransition>
        <div>Contenu de test</div>
      </PageTransition>
    );
    expect(screen.getByText('Contenu de test')).toBeInTheDocument();
  });

  test('applique le style "position: relative"', () => {
    const { container } = render(
      <PageTransition>
        <div>Test</div>
      </PageTransition>
    );
    // Le composant motion.div devrait être rendu en tant que div avec le style défini.
    const divElement = container.firstChild;
    expect(divElement).toHaveStyle('position: relative');
  });
});
