// src/pages/Skills.jsx
import React from 'react';

function Skills() {
  return (
    <section className="skills">
      <h1>Mes Compétences</h1>
      <div className="skills-section">
        <h2>Techniques</h2>
        <ul>
          <li>React / Node.js / Express</li>
          <li>Electronique / Arduino / Raspberry Pi</li>
          {/* etc. */}
        </ul>
      </div>

      <div className="skills-section">
        <h2>Humaines</h2>
        <ul>
          <li>Communication</li>
          <li>Gestion de projet agile</li>
          {/* etc. */}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
