import React from 'react';
import { render } from '@testing-library/react';
import GLTFViewer from '../components/Scene3D';

describe('GLTFViewer (Scene3D) Component', () => {
  test('affiche le model-viewer avec les attributs par défaut', () => {
    const { container } = render(<GLTFViewer />);
    const modelViewer = container.querySelector('model-viewer');
    expect(modelViewer).toBeInTheDocument();

    // Vérifie que l'attribut src contient bien le chemin du fichier glTF (se terminant par .gltf)
    expect(modelViewer.getAttribute('src')).toMatch(/\.gltf$/);
    
    // Vérifie l'attribut alt par défaut
    expect(modelViewer.getAttribute('alt')).toBe('Modèle 3D');
    
    // Vérifie que les attributs auto-rotate et camera-controls sont présents
    expect(modelViewer.hasAttribute('auto-rotate')).toBe(true);
    expect(modelViewer.hasAttribute('camera-controls')).toBe(true);
    
    // Vérifie le style par défaut si aucun style personnalisé n'est fourni
    expect(modelViewer.style.width).toBe('100vw');
    expect(modelViewer.style.height).toBe('100vh');
  });

  test('applique un style personnalisé si fourni', () => {
    const customStyle = { width: '500px', height: '300px' };
    const { container } = render(<GLTFViewer style={customStyle} />);
    const modelViewer = container.querySelector('model-viewer');
    expect(modelViewer.style.width).toBe('500px');
    expect(modelViewer.style.height).toBe('300px');
  });
});
