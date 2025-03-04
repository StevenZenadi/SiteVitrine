import React from 'react';
import './PhotoGallery.css';

function PhotoGallery() {
  // Exemple de tableau d'images avec description
  const photos = [
    { src: '/images/photo1.jpg', description: "Voyage en montagne" },
    { src: '/images/photo2.jpg', description: "Moments en famille" },
    { src: '/images/photo3.jpg', description: "Passion pour le surf" },
    { src: '/images/photo4.jpg', description: "Découverte culturelle" },
  ];

  return (
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <div key={index} className="photo-item">
          <img src={photo.src} alt={photo.description} />
          <p>{photo.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;
