// src/pages/Projects.jsx
import miniatureSnake from "../images/miniatureSnake.mp4";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import miniature1 from "../images/miniature1.png";

// Exemple de données pour les projets
const projectData = [
  {
    id: 1,
    category: 'web',
    title: 'Site Vitrine',
    description: 'Création d’un site vitrine responsive avec React et CSS moderne.',
    image: miniature1,
    tech: ['React', 'CSS', 'GitHub Pages'],
    link: 'https://github.com/StevenZenadi/SiteVitrine'
  },
  {
    id: 3,
    category: 'games',
    title: 'Jeu Snake Amélioré',
    description: 'Prototype interactif d’un jeu Snake avec animations fluides et effets visuels poussés.',
    // Pour la vidéo, on définit un objet avec type, src et poster
    image: { type: 'video', src: miniatureSnake, poster: '/images/project-snake.jpg' },
    tech: ['JavaScript', 'Canvas', 'Animations'],
    link: 'https://github.com/mon-profil/project-snake'
  },
  {
    id: 4,
    category: 'others',
    title: 'Application de Chatbot',
    description: 'Expérimentation avec un chatbot intégré à un site web pour démontrer mes compétences en IA.',
    image: '/images/project-chatbot.jpg',
    tech: ['Node.js', 'Express', 'Dialogflow'],
    link: 'https://github.com/mon-profil/project-chatbot'
  },
  // Ajoutez d'autres projets au besoin...
];

const categories = [
  { key: 'all', label: 'Tous' },
  { key: 'web', label: 'Développement Web' },
  { key: 'iot', label: 'IoT & Hardware' },
  { key: 'games', label: 'Jeux & Démos' },
  { key: 'others', label: 'Autres Expériences' }
];

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [transitioning, setTransitioning] = useState(false);

  const filteredProjects = selectedCategory === 'all'
    ? projectData
    : projectData.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (newCategory) => {
    setTransitioning(true);
    // Durée de transition : 300ms (à ajuster si besoin)
    setTimeout(() => {
      setSelectedCategory(newCategory);
      setTransitioning(false);
    }, 300);
  };

  return (
    <section className="projects-page">
      <h1 className="projects-title">Mes Projets</h1>
      <div className="projects-tabs">
        {categories.map(cat => (
          <button 
            key={cat.key}
            className={`tab ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={`projects-grid ${transitioning ? 'fade-out' : 'fade-in'}`}>
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              {typeof project.image === 'object' && project.image.type === 'video' ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  poster={project.image.poster}
                  className="project-video"
                >
                  <source src={project.image.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              ) : (
                <img src={project.image} alt={project.title} />
              )}
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, i) => <span key={i}>{tech}</span>)}
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                Voir le projet
              </a>
            </div>
          </div>
        ))}
      </div>
      {selectedCategory !== 'all' && (
        <button 
          className="more-projects"
          onClick={() => handleCategoryChange('all')}
        >
          Voir tous les projets
        </button>
      )}
    </section>
  );
}

export default Projects;
