// src/pages/Projects.jsx
import React, { useState } from "react";
import VideoCanvas from "../components/VideoCanvas";
import "./Projects.css";

// Import de vos vidéos
import softwareVideo1 from "../videos/software1.mp4";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo1 from "../videos/learn1.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo1 from "../videos/hardware1.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";

function Projects() {
  const categories = ["software", "hardware", "apprentissage"];
  const [hoverCategory, setHoverCategory] = useState(null);

  const videoMapping = {
    software: [softwareVideo1, softwareVideo2],
    hardware: [hardwareVideo1, hardwareVideo2],
    apprentissage: [learningVideo1, learningVideo2],
  };

  const captions = {
    software: "Découvrez nos solutions Software",
    hardware: "Explorez nos innovations Hardware",
    apprentissage: "Apprenez et recevez des conseils",
  };

  return (
    <div className="projects-page">
      <h1 className="projects-title">Mes Projets</h1>

      <div className="projects-content">
        <div 
          className="tabs-column"
          onMouseLeave={() => setHoverCategory(null)}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${hoverCategory === cat ? "active" : ""}`}
              onMouseEnter={() => setHoverCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="video-column">
          <div className="video-wrapper" key={hoverCategory}>
            {hoverCategory ? (
              <VideoCanvas
                key={hoverCategory}
                videoSources={videoMapping[hoverCategory]}
                duration={3000}
                width={800}
                height={450}
              />
            ) : (
              <div className="video-placeholder">
                <p>Sélectionnez une catégorie</p>
              </div>
            )}
          </div>
          
          {hoverCategory && (
            <div className="video-caption">
              {captions[hoverCategory]}
            </div>
          )}
        </div>
      </div>

      <section className="project-category">
        <p>Aucun contenu pour l'instant.</p>
      </section>
    </div>
  );
}

export default Projects;
