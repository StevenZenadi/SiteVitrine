// src/components/Preloader.jsx
import React, { useState, useEffect } from 'react';
import './Preloader.css';
import logoVideo from '../videos/Logo3.mp4'; // Chemin vers votre vidéo de logo

const Preloader = ({ onFinish }) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Forcer la fin du préloader après 2 secondes, quelle que soit la durée de la vidéo
    const timeout = setTimeout(() => {
      setVideoEnded(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (videoEnded) {
      const timeout = setTimeout(() => {
        onFinish();
      }, 500); // Délai pour laisser le temps à l'animation de fade-out
      return () => clearTimeout(timeout);
    }
  }, [videoEnded, onFinish]);

  return (
    <div className={`preloader ${videoEnded ? 'fade-out' : ''}`}>
      <video
        className="preloader-video"
        src={logoVideo}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default Preloader;
