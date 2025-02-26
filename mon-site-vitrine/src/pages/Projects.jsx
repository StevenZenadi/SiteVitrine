// src/pages/Projects.jsx
import React, { useState,useEffect } from "react";
import VideoCanvas from "../components/VideoCanvas";
import "./Projects.css";
import { useProjectCategory } from "../contexts/ProjectCategoryContext";

// Importez vos vidéos
import softwareVideo1 from "../videos/software1.mp4";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo1 from "../videos/learn1.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo1 from "../videos/hardware1.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";

function Projects() {
  const categories = ["software", "hardware", "apprentissage"];
  // Par défaut, on part sur "software"
  const { projectCategory, setProjectCategory } = useProjectCategory();
  const [hoverCategory, setHoverCategory] = useState("software");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setProjectCategory("software");
  }, [setProjectCategory]);

  const videoMapping = {
    software: [ softwareVideo2],
    hardware: [ hardwareVideo2],
    apprentissage: [learningVideo2],
  };

  const captions = {
    software: "Découvrez nos solutions Software",
    hardware: "Explorez nos innovations Hardware",
    apprentissage: "Apprenez et recevez des conseils",
  };

  const subTitles = {
    software: "Logiciels et Développement",
    hardware: "Matériel et Innovations",
    apprentissage: "Formation et Conseils",
  };

  const handleCategoryChange = (cat) => {
    setProjectCategory(cat);
    setHoverCategory(cat);
    setAnimationKey((prev) => prev + 1);
  };

  // La classe de fond correspond à la catégorie active, ou "software" par défaut
  const backgroundClass = hoverCategory || "software";

  return (
    // On ajoute la classe dynamique au conteneur principal
      <div className={`projects-page ${backgroundClass}`}>
        <div className="projects-content">
          <div
            className="tabs-column"
            onMouseLeave={() => { }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab ${hoverCategory === cat ? "active" : ""} ${cat}`}
                onMouseEnter={() => handleCategoryChange(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="video-column">
            {hoverCategory && (
              <h2 className="video-subtitle" key={`subtitle-${hoverCategory}-${animationKey}`}>
                {subTitles[hoverCategory]}
              </h2>
            )}

            <div className="video-wrapper" key={`${hoverCategory}-${animationKey}`}>
              <VideoCanvas
                videoSources={videoMapping[hoverCategory]}
                duration={3000}
                width={800}
                height={450}
              />
            </div>

            {hoverCategory && (
              <div className="video-caption" key={`caption-${hoverCategory}-${animationKey}`}>
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
