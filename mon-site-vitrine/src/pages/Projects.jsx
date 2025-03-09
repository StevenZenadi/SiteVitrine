// src/pages/Projects.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import miniatureSnake from "../videos/miniatureSnake.mp4";
import miniature1 from "../images/miniature1.png";
import miniature2 from "../images/miniature2.png"; 
import ProjectModal from '../components/ProjectModal';
import modelisation from "../images/modelisation.JPG";
import modelisation0 from "../images/modelisation0.PNG";
import modelisation1 from "../images/modelisation1.PNG";
import modelisation2 from "../images/modelisation2.PNG";
import modelisation3 from "../images/modelisation3.PNG";
import modelisation4 from "../images/modelisation4.png";
import modelisation5 from "../images/modelisation4.JPG";
import modelisation6 from "../images/modelisation5.PNG";
import modelisation7 from "../images/modelisation6.PNG";
import modelisation8 from "../images/modelisation7.jpg";
import modelisation9 from "../images/modelisation8.png";
import modelisation10 from "../images/modelisation10.png";
import modelisation11 from "../images/modelisation11.png";
import modelisation12 from "../images/modelisation12.png";
import modelisation13 from "../images/modelisation13.png";
import modelisation14 from "../images/modelisation14.png";
import interface0 from "../images/interface0.JPG";
import interface1 from "../images/interface1.JPG";
import interface5 from "../images/interface8.JPG";
import interface6 from "../images/interface7.JPG";
import moteur from "../images/moteur0.PNG";
import moteur1 from "../images/moteur1.JPG";
import moteur2 from "../images/moteur3.JPG";

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
    id: 2,
    category: 'modelisation',
    title: 'Modélisation 3D',
    description: 'Projet de modélisation 3D utilisant des outils de CAO pour créer des prototypes innovants.',
    image: modelisation8,
    images: [
      { src: modelisation0, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation1, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation2, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation3, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation4, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation5, caption: "Création et optimisation pour chargement web de modèles de wagons." },
      { src: modelisation6, caption: "Optimisation de modèles 3D." },
      { src: modelisation7, caption: "Optimisation de modèles 3D." },
      { src: modelisation8, caption: "Optimisation de modèles 3D." },
      { src: modelisation9, caption: "Optimisation de modèles 3D." },
      { src: modelisation, caption: "Modélisation sur Sketchup de l'IUT de Dijon." },
      { src: modelisation10, caption: "Modélisation sur Sketchup de l'IUT de Dijon."},
      { src: modelisation11, caption: "Modélisation sur Sketchup de l'IUT de Dijon." },
      { src: modelisation12, caption: "Modélisation sur Sketchup de l'IUT de Dijon."},
      { src: modelisation13, caption: "Modélisation sur Sketchup de l'IUT de Dijon." },
      { src: modelisation14, caption: "Modélisation sur Sketchup de l'IUT de Dijon." },
    ],
    tech: ['Sketchup', '3ds Max', 'Blender'],
    link: '' // ouvrira le modal
  },
  {
    id: 3,
    category: 'games',
    title: 'Jeu Snake Amélioré',
    description: 'Prototype interactif d’un jeu Snake avec animations fluides et effets visuels poussés.',
    image: { type: 'video', src: miniatureSnake, poster: '/images/project-snake.jpg' },
    tech: ['JavaScript', 'Canvas', 'Animations'],
    link: '/jeux'
  },
  {
    id: 4,
    category: 'others',
    title: 'IUT Dijon 3D',
    description: "Prototype de modélisation 3D de l'IUT de Dijon.",
    image: miniature2,
    tech: ['Sketchup'],
    link: '/jeux'
  },
  {
    id: 5,
    category: 'integration',
    title: 'Moteur 3D',
    description: "Intégration de modèles dans Unity pour interfacer une application d'intelligence artificielle.",
    image: moteur,
    images: [
      { src: moteur1, caption: "Ajout des voies ferrées et des bâtiments en fonction des coordonnées GPS." },
      { src: moteur2, caption: "Intégration d'une imagerie satellite basée sur les coordonnées GPS." },
      { src: moteur, caption: "Résultat du prototypage." },
    ],
    tech: ['Unity'],
    link: '' // modal
  },
  {
    id: 6,
    category: 'interfaces',
    title: 'Interfaces',
    description: "Conception d'interfaces utilisateur innovantes avec animations et interactivité.",
    image: interface1,
    images: [
      { src: interface0, caption: "Prototype d'interface." },
      { src: interface6, caption: "Prototype d'interface." },
      { src: interface5, caption: "Prototype d'interface." },
      { src: interface1, caption: "Version retravaillée selon les principes UX." },      
    ],
    tech: ['React', 'Framer Motion'],
    link: '' // modal
  },
];

const categories = [
  { key: 'all', label: 'Tous' },
  { key: 'web', label: 'Développement Web' },
  { key: 'modelisation', label: 'Modélisation 3D' },
  { key: 'integration', label: 'Intégration 3D' },
  { key: 'interfaces', label: 'Interfaces' },
  { key: 'games', label: 'Jeux & Démos' },
  { key: 'others', label: 'Autres Expériences' }
];

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [transitioning, setTransitioning] = useState(false);
  const [modalProject, setModalProject] = useState(null);

  const filteredProjects = selectedCategory === 'all'
    ? projectData
    : projectData.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (newCategory) => {
    setTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(newCategory);
      setTransitioning(false);
    }, 300);
  };

  const openModal = (project) => {
    setModalProject(project);
  };

  const closeModal = () => {
    setModalProject(null);
  };

  // Catégories qui ouvrent une modal
  const isModalCategory = (category) => {
    return category === 'modelisation' || category === 'integration' || category === 'interfaces';
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
              { 
                isModalCategory(project.category) ? (
                  <button onClick={() => openModal(project)} className="project-link">
                    Voir le projet
                  </button>
                ) : (
                  (project.title === 'Jeu Snake Amélioré' || project.title === 'IUT Dijon 3D') ? (
                    <Link to="/jeux" className="project-link">
                      Voir le projet
                    </Link>
                  ) : (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      Voir le projet
                    </a>
                  )
                )
              }
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
      {modalProject && (
        <ProjectModal project={modalProject} onClose={closeModal} />
      )}
    </section>
  );
}

export default Projects;
