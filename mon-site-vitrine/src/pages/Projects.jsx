// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import './Projects.css';

// Exemple de données pour les projets
const projectData = [
  {
    id: 1,
    category: 'web',
    title: 'Site Vitrine',
    description: 'Création d’un site vitrine responsive avec React et CSS moderne.',
    image: '/images/project-web.jpg',
    tech: ['React', 'CSS', 'GitHub Pages'],
    link: 'https://github.com/mon-profil/project-web'
  },
  {
    id: 2,
    category: 'iot',
    title: 'Projet IoT',
    description: 'Développement d’un système IoT utilisant Raspberry Pi et MQTT pour la domotique.',
    image: '/images/project-iot.jpg',
    tech: ['Python', 'Raspberry Pi', 'MQTT'],
    link: 'https://github.com/mon-profil/project-iot'
  },
  {
    id: 3,
    category: 'games',
    title: 'Jeu Snake Amélioré',
    description: 'Prototype interactif d’un jeu Snake avec animations fluides et effets visuels poussés.',
    image: '/images/project-snake.jpg',
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
              <img src={project.image} alt={project.title} />
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
      <div className="projects-footer">
        {selectedCategory !== 'all' && (
          <button
            className="more-projects"
            onClick={() => setSelectedCategory('all')}
          >
            Voir tous les projets
          </button>
        )}
      </div>
    </section>
  );
}

export default Projects;
