import { renderHook, act } from '@testing-library/react-hooks';
import useParallax from '../hooks/useParallax';

describe('useParallax hook', () => {
  test('renvoie 0 initialement', () => {
    const { result } = renderHook(() => useParallax());
    expect(result.current).toBe(0);
  });

  test('met à jour offsetY en fonction de window.pageYOffset', () => {
    // Utilisons un coefficient d'offset de 0.5 (valeur par défaut)
    const { result } = renderHook(() => useParallax(0.5));
    // Au départ, window.pageYOffset vaut 0 donc offsetY doit être 0
    expect(result.current).toBe(0);

    // Simuler un scroll en définissant window.pageYOffset
    window.pageYOffset = 100;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Avec un coefficient de 0.5, offsetY doit être 100 * 0.5 = 50
    expect(result.current).toBe(50);
  });
});
