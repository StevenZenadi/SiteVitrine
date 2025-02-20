// src/pages/Projects.jsx
import React from 'react';

function Projects() {
  // Exemple de liste de projets (à remplacer par un fetch, un JSON, etc. si tu veux).
  const myProjects = [
    {
      title: 'Projet 1',
      description: 'Description de mon super projet software',
      img: '/images/project1.jpg',
    },
    {
      title: 'Projet 2',
      description: 'Un autre projet hardware avec arduino etc.',
      img: '/images/project2.jpg',
    },
  ];

  return (
    <section className="projects">
      <h1>Mes Projets</h1>
      <div className="project-list">
        {myProjects.map((proj, index) => (
          <div className="project-card" key={index}>
            <img src={proj.img} alt={proj.title} />
            <div className="content">
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
