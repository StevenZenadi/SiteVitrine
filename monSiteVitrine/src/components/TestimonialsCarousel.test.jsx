import React from 'react';
import { render, screen } from '@testing-library/react';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

describe('TestimonialsCarousel Component', () => {
  test('affiche le bon nombre de témoignages', () => {
    render(<TestimonialsCarousel />);
    // On s'attend à 3 témoignages
    const testimonials = document.querySelectorAll('.testimonial');
    expect(testimonials.length).toBe(3);
  });

  test('affiche correctement les textes et auteurs des témoignages', () => {
    render(<TestimonialsCarousel />);

    // Vérifie la présence du premier témoignage
    expect(
      screen.getByText(/"Steven est un développeur passionné et créatif."/)
    ).toBeInTheDocument();
    expect(screen.getByText(/- Alice/)).toBeInTheDocument();

    // Vérifie la présence du deuxième témoignage
    expect(
      screen.getByText(/"J'adore collaborer avec lui, il apporte toujours des idées innovantes."/)
    ).toBeInTheDocument();
    expect(screen.getByText(/- Bob/)).toBeInTheDocument();

    // Vérifie la présence du troisième témoignage
    expect(
      screen.getByText(/"Son travail allie technicité et humanité."/)
    ).toBeInTheDocument();
    expect(screen.getByText(/- Claire/)).toBeInTheDocument();
  });
});
