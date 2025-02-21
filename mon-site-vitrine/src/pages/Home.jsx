// src/pages/Home.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ParticlesBg from 'react-tsparticles'; // ou utilisez votre composant ParticlesWrapper si vous préférez
import Header from '../components/Header'; // Par exemple
import TiltCard from '../components/TiltCard';
import HeroBackground from '../components/Background';
import "./Home.css";
import profil from '../images/profil.webp';
import mainImage from '../images/home2.webp';
import imageCardSoftware from '../images/card_software.webp';
import imageCardLearning from '../images/card_learning.webp';
import imageCardHardware from '../images/card_hardware.webp';
import image1 from '../images/1.0.webp';
import image2 from '../images/2.webp';
import image3 from '../images/3.webp';
import image4 from '../images/4.webp';
import image6 from '../images/6.webp';
import image7 from '../images/7.webp';
import image8 from '../images/8.webp';
import image9 from '../images/9.webp';
import { Link } from 'react-router-dom';


function Home() {
  // Données pour les cartes de prestations
  const [cards] = useState([
    {
      id: 1,
      title: "Software",
      description: "Création de sites web responsives et performants.",
      image: imageCardSoftware
    },
    {
      id: 2,
      title: "Apprentissage et conseils",
      description: "Conception d'applications mobiles innovantes.",
      image: imageCardLearning
    },
    {
      id: 3,
      title: "IoT & Hardware",
      description: "Solutions matérielles et connectées sur mesure.",
      image: imageCardHardware
    }
  ]);

  // Données pour le carrousel d'avis
  const [reviews] = useState([
    {
      id: 1,
      author: "Margaux B.",
      text: "Seconde fois que je fais appel à ses services pour m'aider à installer et configurer mon imprimante 3d. Toujours autant de patience et de soin au travail qu'il effectue. Je recommande !",
      service: "Hardware & Software",
      photo: image1,
    },
    {
      id: 2,
      author: "Doudou",
      text: "Très satisfait du montage du pc. J'ai appris pleins de choses par la même occasion.",
      service: "Hardware & Software",
      photo: image2,
    },
    {
      id: 3,
      author: "Louis B.",
      text: "Top tout fonctionne rien a redire.",
      service: "Hardware",
      photo: image3,
    },
    {
      id: 4,
      author: "Clara",
      text: "J'avais besoin de conseils pour penser une configuration de pc en fonction de mes besoins et pour le montage. Pour l'instant très satisfaite.",
      service: "Hardware & Conseils",
      photo: image4,
    },
    {
      id: 5,
      author: "TikTak58",
      text: "J'avais besoin de conseils pour l'aménagement de mon setup gaming. Il m'as aiguillé en fonction de mes besoins et biensur de mon budget. En plus de ca il m'as aidé à tout installer et monter. Top !",
      service: "Hardware & Software & Conseils",
      photo: image6,
    },
    {
      id: 6,
      author: "BoB",
      text: "J'avais besoin d'une petite config avec un petit budget en occasion, il as sue etre efficace.",
      service: "Conseils",
      photo: image7,
    },
    {
      id: 7,
      author: "Sylvie M.",
      text: "Très satisfaite de l'installation. Mon fils est tres content de son ordinateur et mon prote feuille aussi.",
      service: "Hardware & Conseils",
      photo: image8,
    },
    {
      id: 8,
      author: "Ahurit71",
      text: "Top, le pc tourne du feu de dieu.",
      service: "Hardware & Conseils",
      photo: image9,
    },
  ]);

  // Configuration du carrousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } }
    ]
  };

  return (
    <>
      {/* Section Hero avec arrière-plan parallax et particules */}
      <div className="hero-container">
        {/* Utilisation de votre composant HeroBackground pour un effet parallax */}
        <HeroBackground />
        {/* Vous pouvez aussi conserver l'image principale si nécessaire */}
        <img
          src={profil}
          alt="Illustration de mon domaine d'activité"
          className="hero-image"
          loading="lazy"
        />
        <div className="hero-overlay"></div>
        {/* Texte en haut à gauche */}
        <div className="hero-text top-left">
          <h1>Bienvenue sur mon site</h1>
        </div>
        {/* Texte en bas à droite */}
        <div className="hero-text bottom-right">
          <p>Découvrez mes compétences et projets.</p>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Section Cartes de Prestations avec effet tilt */}
      <section className="cards-section">
        {cards.map(card => (
          <Link 
            key={card.id} 
            to={`/projets?cat=${card.category}`} 
            className="card-link"
          >
            <div className="card">
              <img src={card.image} alt={card.title} className="card-image" loading="lazy" />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Section Carrousel d'Avis */}
      <section className="reviews-section">
        <h2>Avis des clients</h2>
        <div className="reviews-carousel">
          <Slider {...sliderSettings}>
            {reviews.map(review => (
              <div key={review.id} className="review-slide">
                <div className="review-content">
                  <div className="review-image">
                    <img src={review.photo} alt={review.author} loading="lazy" />
                  </div>
                  <div className="review-text">
                    <p className="review-comment">"{review.text}"</p>
                    <p className="review-author">
                      - {review.author} <br />
                      Service : {review.service}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}

export default Home;

