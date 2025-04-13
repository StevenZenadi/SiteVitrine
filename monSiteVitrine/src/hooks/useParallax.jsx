// src/hooks/useParallax.js
import { useState, useEffect } from 'react';

function useParallax(offset = 0.5) {
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset * offset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);
  return offsetY;
}

export default useParallax;
