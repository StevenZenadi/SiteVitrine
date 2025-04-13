import React from 'react';
import './PresentationMedia.css';

function PresentationMedia() {
  return (
    <div className="presentation-media">
      {/* Vous pouvez intégrer une vidéo hébergée sur YouTube, Vimeo ou un fichier local */}
      <video controls width="100%" poster="/images/video-poster.jpg">
        <source src="/videos/presentation.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
      <p>Découvrez ma présentation personnelle dans cette courte vidéo.</p>
    </div>
  );
}

export default PresentationMedia;
