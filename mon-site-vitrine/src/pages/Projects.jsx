// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import VideoCanvas from "../components/VideoCanvas";
import "./Projects.css";
import { useProjectCategory } from "../contexts/ProjectCategoryContext";
import softwareVideo2 from "../videos/software2.mp4";
import learningVideo2 from "../videos/learn2.mp4";
import hardwareVideo2 from "../videos/hardware2.mp4";
import RandomCirclesBackground from "../components/RandomCirclesBackground";

function Projects() {
  const categories = ["software", "hardware", "apprentissage"];
  const { projectCategory, setProjectCategory } = useProjectCategory();
  const [hoverCategory, setHoverCategory] = useState("software");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setProjectCategory("software");
  }, [setProjectCategory]);

  const videoMapping = {
    software: [softwareVideo2],
    hardware: [hardwareVideo2],
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

  const backgroundClass = hoverCategory || "software";

  return (
    <div className={`projects-page ${backgroundClass}`}>
      <RandomCirclesBackground selectedCategory={backgroundClass} />

      {/* Barre d'onglets horizontale */}
      <div className="tabs-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${hoverCategory === cat ? "active" : ""} ${cat}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="projects-content">
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
              width={600}
              height={338}
            />
          </div>
          {hoverCategory && (
            <>
              <div className="video-caption" key={`caption-${hoverCategory}-${animationKey}`}>
                {captions[hoverCategory]}
              </div>
              <div className="video-cta-container">
                <button className="video-cta">
                  Voir tous les projets {hoverCategory}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <section className="project-category">
        <p>Restez connecté, de nouvelles réalisations arrivent bientôt !</p>
      </section>
    </div>
  );
}

export default Projects;
