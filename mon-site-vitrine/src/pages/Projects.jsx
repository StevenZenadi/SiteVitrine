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
    // Catégorie par défaut
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

  // Classe de fond dynamique (catégorie)
  const backgroundClass = hoverCategory || "software";

  return (
    <div className={`projects-page ${backgroundClass}`}>
      {/* Arrière-plan décoratif */}
      <RandomCirclesBackground selectedCategory={backgroundClass} />

      {/* Titre principal de la page */}
      <h1 className="page-main-title">Nos Projets</h1>

      <div className="projects-content">
        {/* Colonne des onglets */}
        <div className="tabs-column">
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

        {/* Colonne de la vidéo + légende */}
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
              width={600}   // <-- Largeur réduite
              height={338}  // Pour conserver un ratio proche de 16:9
            />
          </div>

          {hoverCategory && (
            <>
              <div className="video-caption" key={`caption-${hoverCategory}-${animationKey}`}>
                {captions[hoverCategory]}
              </div>
              {/* CTA : lien ou bouton pour en savoir plus */}
              <div className="video-cta-container">
                <button className="video-cta">
                  Voir tous les projets {hoverCategory}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section de contenu en cours */}
      <section className="project-category">
        <p>Restez connecté, de nouvelles réalisations arrivent bientôt !</p>
      </section>
    </div>
  );
}

export default Projects;
