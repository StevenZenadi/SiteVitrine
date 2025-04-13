import React, { useEffect } from 'react';
import './About.css';
import LogoAnimated from '../components/LogoAnimated';
import PhotoGallery from '../components/PersonalProjects';
import Timeline from '../components/Timeline';
import BeyondWork from '../components/BeyondWork';
import PresentationMedia from '../components/PresentationMedia';
import AnecdotesQuotes from '../components/AnecdotesQuotes';
import myPhoto from '../images/Profil.jpg';
import cv from "../ressources/cv.pdf";

function About() {
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    faders.forEach(fader => observer.observe(fader));
    return () => {
      faders.forEach(fader => observer.unobserve(fader));
    };
  }, []);

  return (
    <div className="about-page">
      {/* Logo animé en haut (décommente si besoin) */}
      {/* <LogoAnimated /> */}

      {/* Contenu principal */}
      <div className="about-content">
        <h1 className="fade-in">À Propos de Moi</h1>
        <h2 className="about-subtitle fade-in">
          Ingénieur Full-Stack & IoT Passionné
        </h2>
        <img src={myPhoto} alt="Mon profil" className="about-photo fade-in" />
        <p className="fade-in">
          Bienvenue ! Je m'appelle Steven Zenadi et je suis passionné par la création
          de solutions innovantes. Découvrez ici
          un aperçu de mon parcours, de mes passions et de ce qui me motive au quotidien.
        </p>

        {/* Galerie Photo Interactive */}
        <section className="section-gallery fade-in">
          <h3>Projets persos</h3>
          <PhotoGallery />
        </section>

        {/* Timeline Personnelle */}
        <section className="section-timeline fade-in">
          <h3>Ma Timeline</h3>
          <Timeline />
        </section>

        {/* Au-delà du travail */}
        <section className="section-beyond fade-in">
          <h3>Au-delà du travail</h3>
          <BeyondWork />
        </section>

        {/* Présentation Vidéo/Audio (section commentée, active-la si besoin) */}
        {/*
        <section className="section-presentation fade-in">
          <h3>Présentation Vidéo</h3>
          <PresentationMedia />
        </section>
        */}

        {/* Anecdotes et Citations */}
        <section className="section-anecdotes fade-in">
          <h3>Anecdotes & Citations</h3>
          <AnecdotesQuotes />
        </section>

        {/* Appels à l'action */}
        <div className="about-cta-container fade-in">
          <a href={cv} className="about-cta" download>
            Télécharger mon CV
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
