// src/pages/Projects.jsx
import softwareVideo1 from "../videos/software1.mp4";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo1 from "../videos/learn1.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo1 from "../videos/hardware1.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";

import React, { useState } from "react";
import VideoCanvas from "../components/VideoCanvas";
import "./Projects.css";

function Projects() {
  // Exemple de données pour les projets
  const projects = [
    {
      id: 1,
      title: "Projet Software 1",
      description: "Description du projet software 1.",
      category: "software",
      image: "/images/project1.jpg",
    },
    {
      id: 2,
      title: "Projet Hardware 1",
      description: "Description du projet hardware 1.",
      category: "hardware",
      image: "/images/project2.jpg",
    },
    // ... autres projets
  ];

  // Liste des catégories disponibles
  const categories = ["software", "hardware", "apprentissage"];
  
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || categories[0]; // Par défaut la première catégorie
  const [activeCategory, setActiveCategory] = useState(initialCat);

  // Mapping de chaque catégorie à une vidéo (uniquement une vidéo par catégorie)
  const videoMapping = {
    software: [softwareVideo1, softwareVideo2],
    hardware: [hardwareVideo1, hardwareVideo2],
    apprentissage: [learningVideo1, learningVideo2],
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
        {filteredProjects.length > 0 ? (
          <div className="project-grid">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="project-card">
                <img src={proj.image} alt={proj.title} className="project-image" />
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun contenu pour l'instant.</p>
        )}
      </section>
    </div>
  );
}

export default Projects;
