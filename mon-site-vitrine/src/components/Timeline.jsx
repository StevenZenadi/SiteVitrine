import React from 'react';
import './Timeline.css';

function Timeline() {
  // Exemple de points de timeline
  const events = [
    { year: "2015", title: "Début d'études", description: "Commencement de mon parcours en informatique." },
    { year: "2018", title: "Premier projet", description: "Lancement de mon premier projet personnel." },
    { year: "2020", title: "Expérience pro", description: "Rejoindre une startup innovante." },
    { year: "2022", title: "Nouveaux défis", description: "Se diversifier dans l'IoT et les objets connectés." },
  ];

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={index} className="timeline-event">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <span className="timeline-year">{event.year}</span>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
