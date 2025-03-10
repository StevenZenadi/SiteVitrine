import React from 'react';
import ProjectGallery from './ProjectGallery';
import './PersonalProjects.css';

import van1 from "../images/projetsPerso/van1.webp";
import van2 from "../images/projetsPerso/van2.webp";
import van3 from "../images/projetsPerso/van3.webp";
import van4 from "../images/projetsPerso/van4.webp";
import van5 from "../images/projetsPerso/van5.webp";
import van6 from "../images/projetsPerso/van6.webp";
import van7 from "../images/projetsPerso/van7.webp";
import van8 from "../images/projetsPerso/van8.webp";
import van9 from "../images/projetsPerso/van9.webp";
import van10 from "../images/projetsPerso/van10.webp";
import van11 from "../images/projetsPerso/van11.webp";
import van12 from "../images/projetsPerso/van12.webp";
import voiture1 from "../images/projetsPerso/voiture1.webp";
import voiture2 from "../images/projetsPerso/voiture2.webp";
import voiture3 from "../images/projetsPerso/voiture3.webp";
import voiture4 from "../images/projetsPerso/voiture4.webp";
import voiture5 from "../images/projetsPerso/voiture5.webp";
import voiture6 from "../images/projetsPerso/voiture6.webp";
import voiture7 from "../images/projetsPerso/voiture7.webp";
import voiture8 from "../images/projetsPerso/voiture8.mp4";

function PersonalProjects() {
  // Exemple de données, chaque projet a un tableau d'images/vidéos avec légende
  const projects = [
    {
      title: "Aménagement de mon Van",
      description: "Transformation complète d’un utilitaire en espace de vie personnalisé.",
      images: [
        { src: van1, caption: "Interieur du van avant transformation." },
        { src: van2, caption: "On vide tout." },
        { src: van3, caption: "On nettoie et traite la rouille." },
        { src: van4, caption: "On récepotionne les colis." },
        { src: van5, caption: "On isole." },
        { src: van6, caption: "On fait deux trois cablages pour les options manquantes. " },
        { src: van7, caption: "Cameras de recul installée." },
        { src: van8, caption: "On decoupe le trou pour la futur fenêtre." },
        { src: van9, caption: "On pose la fenêtre." },
        { src: van10, caption: "Deux trois habillages definitifs, ou non." },
        { src: van11, caption: "C'est plutôt joli." },
        { src: van12, caption: "On positionne et cole les panneau solaires." },
      ]
    },
    {
      title: "Atelier DIY",
      description: "Creation d'un modèle personnalisé sur base de classe A 200. Pensée et réalisée par votre serviteur.",
      images: [
        { src: voiture1, caption: "Avant" },
        { src: voiture2, caption: "Avant" },
        { src: voiture3, caption: "Avant" },
        { src: voiture4, caption: "Après" },
        { src: voiture5, caption: "Après" },
        { src: voiture6, caption: "Cuir remplacé par du daim." },
        { src: voiture7, caption: "Ciel etoilé." },
        { type: 'video', src: voiture8, poster: voiture4, caption: "Sound ON !" },
      ]
    },
  ];

  return (
    <div className="personal-projects">
      {projects.map((proj, index) => (
        <div key={index} className="personal-project-card">
          <h4>{proj.title}</h4>
          {/* Passez la prop sous le nom "media" */}
          <ProjectGallery media={proj.images} />
          <p>{proj.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PersonalProjects;
