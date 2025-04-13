import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader Component', () => {
  test('affiche le spinner et le texte "Loading..."', () => {
    render(<Loader />);
    
    // Vérifier que le conteneur principal a la classe "loader"
    const loaderDiv = screen.getByText(/Loading.../i).closest('.loader');
    expect(loaderDiv).toBeInTheDocument();
    
    // Vérifier que le spinner est présent
    const spinner = loaderDiv.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    
    // Vérifier que le texte "Loading..." est bien affiché
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
