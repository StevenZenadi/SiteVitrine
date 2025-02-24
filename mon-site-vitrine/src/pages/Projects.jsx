// src/pages/Projects.jsx
import React, { useState } from "react";
import VideoCanvas from "../components/VideoCanvas";
import "./Projects.css";

import softwareVideo1 from "../videos/software1.mp4";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo1 from "../videos/learn1.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo1 from "../videos/hardware1.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";

function Projects() {
  const categories = ["software", "hardware", "apprentissage"];

  // On part par exemple sur "software"
  const [hoverCategory, setHoverCategory] = useState("software");
  const [animationKey, setAnimationKey] = useState(0);

  const videoMapping = {
    software: [softwareVideo1],
    hardware: [hardwareVideo1],
    apprentissage: [learningVideo1],
  };

  const captions = {
    software: "Découvrez nos solutions Software",
    hardware: "Explorez nos innovations Hardware",
    apprentissage: "Apprenez et recevez des conseils",
  };

  // Fonction qui change la catégorie et incrémente la clé pour rejouer l'animation
  const handleCategoryChange = (cat) => {
    setHoverCategory(cat);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="projects-page">
      <h1 className="projects-title">Mes Projets</h1>

      <div className="projects-content">
        {/* Colonne de gauche : onglets */}
        <div className="tabs-column">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${hoverCategory === cat ? "active" : ""}`}
              onMouseEnter={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Colonne de droite : vidéo + légende */}
        <div className="video-column">
          <div 
            className="video-wrapper" 
            key={`${hoverCategory}-${animationKey}`}
          >
            <VideoCanvas
              videoSources={videoMapping[hoverCategory]}
              duration={3000}
              width={800}
              height={450}
            />
          </div>
          <div 
            className="video-caption" 
            key={`caption-${hoverCategory}-${animationKey}`}
          >
            {captions[hoverCategory]}
          </div>
        </div>
      </div>

      <section className="project-category">
        <p>Aucun contenu pour l'instant.</p>
      </section>
    </div>
  );
}

export default Projects;
