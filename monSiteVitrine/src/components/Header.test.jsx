import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../components/Header';
import { MemoryRouter } from 'react-router-dom';

describe('Header Component', () => {
  const renderHeader = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Header />
      </MemoryRouter>
    );
  };

  test('affiche le logo et tous les liens de navigation', () => {
    renderHeader('/');
    // Vérifier la présence du logo dynamique (dans le lien "logo-link")
    const logoLink = document.querySelector('.logo-link');
    expect(logoLink).toBeInTheDocument();

    // Vérifier la présence de tous les liens du menu
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    expect(screen.getByText('Démos')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('le bouton burger bascule l\'affichage du menu', () => {
    renderHeader('/');
    const burgerButton = document.querySelector('.burger-button');
    const nav = document.querySelector('.nav');
    expect(burgerButton).toBeInTheDocument();
    expect(nav).toBeInTheDocument();

    // Au départ, le menu n'est pas ouvert (absence de la classe "nav-open")
    expect(nav.classList.contains('nav-open')).toBe(false);

    // Ouvrir le menu en cliquant sur le bouton burger
    fireEvent.click(burgerButton);
    expect(nav.classList.contains('nav-open')).toBe(true);

    // Fermer le menu en cliquant de nouveau sur le bouton
    fireEvent.click(burgerButton);
    expect(nav.classList.contains('nav-open')).toBe(false);
  });

  test('cliquer sur un lien du menu ferme le menu burger ouvert', () => {
    renderHeader('/');
    const burgerButton = document.querySelector('.burger-button');
    const nav = document.querySelector('.nav');

    // Ouvrir le menu
    fireEvent.click(burgerButton);
    expect(nav.classList.contains('nav-open')).toBe(true);

    // Cliquer sur le lien "Accueil" (ou tout autre lien)
    const accueilLink = screen.getByText('Accueil');
    fireEvent.click(accueilLink);
    // Le menu doit être fermé
    expect(nav.classList.contains('nav-open')).toBe(false);
  });

  test('l\'indicateur se positionne sur l\'onglet actif et se met à jour lors du survol', () => {
    renderHeader('/');

    // Pour tester la mise à jour de l'indicateur, nous devons simuler des valeurs pour offsetLeft et offsetWidth.
    // Ici, on définit pour le lien "Accueil" (qui est actif sur "/")
    const accueilLink = screen.getByText('Accueil');
    Object.defineProperty(accueilLink, 'offsetLeft', { value: 50, configurable: true });
    Object.defineProperty(accueilLink, 'offsetWidth', { value: 100, configurable: true });

    // L'indicateur est un élément avec la classe "menu-indicator"
    const indicator = document.querySelector('.menu-indicator');
    // Au montage, l'indicateur devrait se positionner sur l'onglet actif ("Accueil")
    // On utilise act pour laisser s'exécuter le useEffect
    act(() => {});

    expect(indicator.style.left).toBe('50px');
    expect(indicator.style.width).toBe('100px');

    // Simuler le survol d'un autre onglet, par exemple "Projets"
    const projetsLink = screen.getByText('Projets');
    Object.defineProperty(projetsLink, 'offsetLeft', { value: 200, configurable: true });
    Object.defineProperty(projetsLink, 'offsetWidth', { value: 80, configurable: true });

    fireEvent.mouseEnter(projetsLink);
    expect(indicator.style.left).toBe('200px');
    expect(indicator.style.width).toBe('80px');

    // Lorsque la souris quitte, l'indicateur se repositionne sur l'onglet actif
    fireEvent.mouseLeave(projetsLink);
    // On relance l'updateIndicator, qui devrait remettre l'indicateur sur "Accueil"
    expect(indicator.style.left).toBe('50px');
    expect(indicator.style.width).toBe('100px');
  });
});
