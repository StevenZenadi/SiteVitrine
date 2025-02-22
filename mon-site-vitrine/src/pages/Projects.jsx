// src/pages/Projects.jsx
import softwareVideo1 from "../videos/software1.mp4";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo1 from "../videos/learn1.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo1 from "../videos/hardware1.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";

import VideoCanvas from "../components/VideoCanvas";
// src/pages/Projects.jsx
import React, { useState } from "react";
import "./Projects.css";

function Projects() {
  const categories = ["software", "hardware", "apprentissage"];
  const [hoverCategory, setHoverCategory] = useState(null);

  // Mapping de chaque catégorie à un tableau de vidéos
  const videoMapping = {
    software: [softwareVideo1, softwareVideo2],
    hardware: [learningVideo1, learningVideo2],
    apprentissage: [hardwareVideo1, hardwareVideo2],
  };

  return (
    <div className="projects-page">
      <h1>Mes Projets</h1>
      <div className="categories-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className="tab"
            onMouseEnter={() => setHoverCategory(cat)}
            onMouseLeave={() => setHoverCategory(null)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Bande vidéo sous les onglets : affichée uniquement lors du survol */}
      {hoverCategory && (
        <div className="video-banner">
          <VideoCanvas videoSources={videoMapping[hoverCategory]} duration={4000} width={800} height={450} />
        </div>
      )}

      <section className="project-category">
        <p>Aucun contenu pour l'instant.</p>
      </section>
    </div>
  );
}

export default Projects;
