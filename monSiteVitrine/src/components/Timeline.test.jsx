import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from '../components/Timeline';

describe('Timeline Component', () => {
  test('affiche le bon nombre d\'événements', () => {
    const { container } = render(<Timeline />);
    const events = container.querySelectorAll('.timeline-event');
    // On s'attend à 7 événements d'après le tableau dans le composant
    expect(events.length).toBe(7);
  });

  test('affiche correctement le contenu d\'un événement', () => {
    render(<Timeline />);
    // On vérifie pour l'événement de l'année 2021
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('Au revoir. Bonjour !')).toBeInTheDocument();
    expect(
      screen.getByText(/Quitte le CIAD et la metropole Dijonnaise pour Paris et Finovox\./i)
    ).toBeInTheDocument();
  });

  test('affiche un point pour chaque événement', () => {
    const { container } = render(<Timeline />);
    const dots = container.querySelectorAll('.timeline-dot');
    // Le nombre de dots doit correspondre au nombre d'événements
    expect(dots.length).toBe(7);
  });
});
