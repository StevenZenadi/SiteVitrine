import React from 'react';
import './Timeline.css';

function Timeline() {
  // Exemple de points de timeline
  const events = [
    { year: "2016", title: "Adulte en devenir.", description: "Commencement de mon parcours en DUT informatique." },
    { year: "2018", title: "Junior.", description: "Rejoins le CIAD en tant qu'ingenieur de recherche. Rejoins l'equipe enseignante de la fac de Dijon." },
    { year: "2019", title: "On parle de vous.", description: "Rejoins l'equipe enseignante de Polytech Dijon." },
    { year: "2021", title: "Au revoir. Bonjour !", description: "Quitte le CIAD et la metropole Dijonnaise pour Paris et Finovox." },
    { year: "2023", title: "Apres l'effort, le reconfort.", description: "Après 7 années acharnées il est temps de souffler un peu." },
    { year: "2024", title: "I'll be back.", description: "Debut d'equivalence bac+5 specialité RSSI. Formation chef de projet by Microsoft." },
    { year: "2025", title: "Il est frais mon poisson !", description: "De retour sur le marché." },

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
