import React from 'react';
import './Timeline.css';

function Timeline() {
  // Exemple de points de timeline
  const events = [
    { year: "2016", title: "Adulte en devenir.", description: (<>Commencement de mon parcours en informatique.</>)},
    { year: "2018", title: "Junior.", description: (<>Rejoins le <a href="https://www.ciad-lab.fr" target="_blank" rel="noopener noreferrer">CIAD</a> en tant qu'ingenieur de recherche. Rejoins l'equipe enseignante de la <a href="https://www.ube.fr" target="_blank" rel="noopener noreferrer">fac de Dijon</a>.</>)},
    { year: "2019", title: "On parle de vous.", description: (<>Rejoins l'equipe enseignante de  <a href="https://polytech.ube.fr/" target="_blank" rel="noopener noreferrer"> Polytech Dijon</a>.</>)},
    { year: "2021", title: "Au revoir. Bonjour !", description: (<>Quitte le <a href="https://www.ciad-lab.fr" target="_blank" rel="noopener noreferrer">CIAD</a> et la metropole Dijonnaise pour Paris et <a href="https://www.finovox.com" target="_blank" rel="noopener noreferrer">Finovox</a>.</>)},
    { year: "2023", title: "Apres l'effort, le reconfort.", description: (<>Après 7 années acharnées il est temps de souffler un peu.</>)},
    { year: "2024", title: "I'll be back.", description: (<>Debut d'equivalence bac+5 specialité  <a href="https://seela.io/cybertraining/responsable-de-la-securite-des-systemes-dinformation-rssi/#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjEzMzYyIiwidG9nZ2xlIjpmYWxzZX0%3D" target="_blank" rel="noopener noreferrer"> RSSI</a>. Formation chef de projet by Microsoft.</>)},
    { year: "2025", title: "Il est frais mon poisson !", description: (<>De retour sur le marché.</>)}

  ];

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={index} className={`timeline-event ${index % 2 === 0 ? "left" : "right"}`}>
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
