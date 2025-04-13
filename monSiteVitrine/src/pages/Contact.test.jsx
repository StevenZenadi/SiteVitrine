import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '../pages/Contact';

describe('Page Contact', () => {
  // Avant tous les tests, on redéfinit window.location pour pouvoir vérifier sa modification
  beforeAll(() => {
    delete window.location;
    window.location = { href: '' };
  });

  test('affiche les éléments de base de la page Contact', () => {
    render(<Contact />);
    // Vérifie la présence du titre "Contactez-moi"
    expect(screen.getByText(/Contactez-moi/i)).toBeInTheDocument();
    // Vérifie la présence de l'accroche personnelle
    expect(
      screen.getByText(/Passionné par la création de projets innovants/i)
    ).toBeInTheDocument();
    // Vérifie la présence de l'image de profil
    expect(screen.getByAltText(/Mon portrait/i)).toBeInTheDocument();
    // Vérifie le lien vers LinkedIn
    const linkedinLink = screen.getByRole('link', { name: /Mon LinkedIn/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/steven-zenadi-885281150'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('soumet le formulaire et ouvre un lien mailto avec les données saisies, puis réinitialise le formulaire', () => {
    render(<Contact />);
    // Récupérer les champs du formulaire
    const nameInput = screen.getByLabelText(/Nom/i);
    const emailInput = screen.getByLabelText(/Adresse Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    
    // Simuler la saisie des données
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello world' } });
    
    // Soumettre le formulaire en cliquant sur le bouton "Envoyer"
    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    fireEvent.click(submitButton);
    
    // Construire le lien mailto attendu
    const subject = encodeURIComponent("IMPORTANT");
    const body = encodeURIComponent(`Nom : Test Name\nEmail : test@example.com\n\nHello world`);
    const expectedMailto = `mailto:steven.zenadi@orange.fr?subject=${subject}&body=${body}`;
    
    // Vérifier que window.location.href a été modifié
    expect(window.location.href).toBe(expectedMailto);
    
    // Vérifier que les champs du formulaire ont été réinitialisés
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });
});
