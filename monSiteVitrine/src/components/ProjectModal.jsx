// src/components/ProjectModal.jsx
import React from 'react';
import ProjectGallery from './ProjectGallery';
import './ProjectModal.css';

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        <h2 className="modal-title">{project.title}</h2>
        <ProjectGallery media={project.images} />
        <p className="modal-description">{project.description}</p>
      </div>
    </div>
  );
}

export default ProjectModal;
