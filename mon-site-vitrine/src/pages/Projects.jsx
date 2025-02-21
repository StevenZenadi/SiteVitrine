// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

  // Fonction pour convertir le nom de la catégorie en un titre lisible
  const getCategoryTitle = (cat) => {
    switch (cat) {
      case "software":
        return "Projets Software";
      case "hardware":
        return "Projets Hardware";
      case "apprentissage":
        return "Apprentissage et Conseils";
      default:
        return cat;
    }
  };

  // Filtrer les projets en fonction de la catégorie active
  const filteredProjects = projects.filter(
    (proj) => proj.category === activeCategory
  );

  // Optionnel : mettre à jour l'onglet actif si le paramètre change
  useEffect(() => {
    setActiveCategory(initialCat);
  }, [initialCat]);

  return (
    <div className="projects-page">
      <h1>Mes Projets</h1>
      <div className="categories-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryTitle(cat)}
          </button>
        ))}
      </div>
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
