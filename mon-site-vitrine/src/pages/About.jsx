import React from 'react';
import './About.css';
import LogoAnimated from '../components/LogoAnimated';
import PhotoGallery from '../components/PhotoGallery';
import Timeline from '../components/Timeline';
import BeyondWork from '../components/BeyondWork';
import PresentationMedia from '../components/PresentationMedia';
import AnecdotesQuotes from '../components/AnecdotesQuotes';
import myPhoto from '../images/Profil.jpg';

function About() {
  return (
    <div className="about-page">
      {/* Logo animé en haut */}
      <LogoAnimated />

      {/* Contenu principal */}
      <div className="about-content">
        <h1>À Propos de Moi</h1>
        <h2 className="about-subtitle">Développeur Web & IoT Passionné</h2>
        <img src={myPhoto} alt="Mon profil" className="about-photo" />
        <p>
          Bienvenue ! Je m'appelle Steven Zenadi et je suis passionné par la création de solutions innovantes 
          alliant développement web et objets connectés. Découvrez ici un aperçu de mon parcours, de mes passions et de ce qui me motive au quotidien.
        </p>

        {/* Galerie Photo Interactive */}
        <section className="section-gallery">
          <h3>Galerie Photo Interactive</h3>
          <PhotoGallery />
        </section>

        {/* Timeline Personnelle */}
        <section className="section-timeline">
          <h3>Ma Timeline</h3>
          <Timeline />
        </section>

        {/* Au-delà du travail */}
        <section className="section-beyond">
          <h3>Au-delà du travail</h3>
          <BeyondWork />
        </section>

        {/* Présentation Vidéo/Audio */}
        <section className="section-presentation">
          <h3>Présentation Vidéo</h3>
          <PresentationMedia />
        </section>

        {/* Anecdotes et Citations */}
        <section className="section-anecdotes">
          <h3>Anecdotes & Citations</h3>
          <AnecdotesQuotes />
        </section>

        {/* Appels à l'action */}
        <div className="about-cta-container">
          <a href="/cv.pdf" className="about-cta" download>
            Télécharger mon CV
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
