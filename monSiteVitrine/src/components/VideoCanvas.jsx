// src/components/VideoCanvas.jsx
import React, { useRef, useState, useEffect } from "react";

function VideoCanvas({ videoSources = [], duration = 3000, width = "100%", height = "100%" }) {
  // Création d'une playlist avec chaque source et son temps actuel
  const [playlist, setPlaylist] = useState(videoSources.map(src => ({ src, currentTime: 0 })));
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  // À l'initialisation, on crée l'élément vidéo
  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;
  }, []);

  // Charger la vidéo courante lorsque l'index change
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const current = playlist[currentIndex];
      video.src = current.src;
      video.currentTime = current.currentTime;
      video.play().catch((err) => console.error(err));
    }
  }, [currentIndex, playlist]);

  // Intervalle pour passer à la vidéo suivante toutes les "duration" millisecondes
  useEffect(() => {
    if (playlist.length === 0) return;
    const interval = setInterval(() => {
      if (videoRef.current) {
        const video = videoRef.current;
        // Sauvegarder le temps actuel de la vidéo courante
        setPlaylist(prev => {
          const newList = [...prev];
          newList[currentIndex].currentTime = video.currentTime;
          // Si la vidéo est terminée, remettre à 0
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

  // Boucle de rendu sur le canvas avec effet "contain"
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // On suppose que width et height sont des nombres (ex. 800 et 450)
    const canvasWidth = width;
    const canvasHeight = height;

    const render = () => {
      if (videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA) {
        const video = videoRef.current;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // Obtenir les dimensions naturelles de la vidéo
        const videoW = video.videoWidth;
        const videoH = video.videoHeight;
        // Calculer l'échelle pour que la vidéo soit entièrement visible (contain)
        const scale = Math.min(canvasWidth / videoW, canvasHeight / videoH);
        const newW = videoW * scale;
        const newH = videoH * scale;
        // Centrer la vidéo dans le canvas
        const xOffset = (canvasWidth - newW) / 2;
        const yOffset = (canvasHeight - newH) / 2;
        ctx.drawImage(video, xOffset, yOffset, newW, newH);
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

export default VideoCanvas;
