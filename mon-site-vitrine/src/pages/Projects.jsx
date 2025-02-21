import React, { useState } from "react";
import "./Projects.css";

function Projects() {
  // Exemple de données pour les projets
  const projects = [
    {
      id: 1,
      title: "Projet Hardware 1",
      description: "Description du projet hardware 1.",
      category: "hardware",
      image: "/images/project1.jpg",
    },
    {
      id: 2,
      title: "Projet Software 1",
      description: "Description du projet software 1.",
      category: "software",
      image: "/images/project2.jpg",
    },
    {
      id: 3,
      title: "Projet Hardware 2",
      description: "Description du projet hardware 2.",
      category: "hardware",
      image: "/images/project3.jpg",
    },
    {
      id: 4,
      title: "Projet Software 2",
      description: "Description du projet software 2.",
      category: "software",
      image: "/images/project4.jpg",
    },
    // Aucun projet pour "apprentissage" pour le moment
  ];

  // Liste des catégories disponibles
  const categories = ["hardware", "software", "apprentissage"];
  // Etat pour la catégorie active (par défaut "hardware")
  const [activeCategory, setActiveCategory] = useState("hardware");

  // Fonction pour convertir le nom de la catégorie en un titre lisible
  const getCategoryTitle = (cat) => {
    switch (cat) {
      case "hardware":
        return "Projets Hardware";
      case "software":
        return "Projets Software";
      case "apprentissage":
        return "Apprentissage et Conseils";
      default:
        return cat;
    }
  };

  // Filtrage des projets en fonction de la catégorie active
  const filteredProjects = projects.filter(
    (proj) => proj.category === activeCategory
  );

  return (
    <div className="projects-page">
      <h1>Mes Projets</h1>
      {/* Onglets de catégories */}
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
      {/* Affichage de la catégorie active */}
      <section className="project-category">
        {filteredProjects.length > 0 ? (
          <div className="project-grid">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="project-card">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="project-image"
                />
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
