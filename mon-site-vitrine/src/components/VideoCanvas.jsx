// src/components/VideoBackground.jsx
import React, { useRef, useState, useEffect } from "react";

function VideoBackground({ videoSources = [], duration = 4000, width = 640, height = 360 }) {
  // Crée une liste d'objets pour le playlist : { src, currentTime }
  const [playlist, setPlaylist] = useState(videoSources.map(src => ({ src, currentTime: 0 })));
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  // À l'initialisation, créer l'élément vidéo
  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;
  }, []);

  // Charger la vidéo courante quand l'index change
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const current = playlist[currentIndex];
      video.src = current.src;
      // Réglez la position en fonction de ce qui a été enregistré
      video.currentTime = current.currentTime;
      video.play().catch((err) => console.error(err));
    }
  }, [currentIndex, playlist]);

  // Intervalle pour passer à la vidéo suivante toutes les 4 secondes
  useEffect(() => {
    if (playlist.length === 0) return;
    const interval = setInterval(() => {
      if (videoRef.current) {
        const video = videoRef.current;
        // Sauvegarder le temps actuel de la vidéo courante
        setPlaylist(prev => {
          const newList = [...prev];
          newList[currentIndex].currentTime = video.currentTime;
          // Si la vidéo est terminée, la remettre à 0
          if (video.ended) {
            newList[currentIndex].currentTime = 0;
          }
          return newList;
        });
        // Passer à la vidéo suivante
        setCurrentIndex(prevIndex => (prevIndex + 1) % playlist.length);
      }
    }, duration);
    return () => clearInterval(interval);
  }, [duration, currentIndex, playlist.length]);

  // Boucle de rendu sur le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      if (videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [width, height]);

  return (
    <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block' }} />
  );
}

export default VideoBackground;
