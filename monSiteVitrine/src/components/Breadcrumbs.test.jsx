import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '../components/Breadcrumbs';

describe('Breadcrumbs Component', () => {
  test('affiche correctement les segments avec le séparateur " > "', () => {
    const segments = ['Accueil', 'Projets', 'Détails'];
    render(<Breadcrumbs segments={segments} />);
    // Vérifie que le texte complet "Accueil > Projets > Détails" est affiché
    expect(screen.getByText('Accueil > Projets > Détails')).toBeInTheDocument();
  });

  test('affiche une breadcrumb vide si le tableau des segments est vide', () => {
    render(<Breadcrumbs segments={[]} />);
    const navElement = screen.getByRole('navigation');
    expect(navElement.textContent).toBe('');
  });

  test('affiche une breadcrumb vide si la prop segments n\'est pas fournie', () => {
    render(<Breadcrumbs />);
    const navElement = screen.getByRole('navigation');
    expect(navElement.textContent).toBe('');
  });
});
