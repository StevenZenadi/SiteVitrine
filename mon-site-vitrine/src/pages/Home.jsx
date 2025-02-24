// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '../components/Header';
import TiltCard from '../components/TiltCard';
import "./Home.css";
import profil from '../images/profilTransparent.webp';
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

function Home() {
  // Données pour les cartes de prestations
  const [cards] = useState([
    {
      id: 1,
      title: "Software",
      description: "Création de sites web responsives et performants.",
      image: imageCardSoftware,
      category: "software"
    },
    {
      id: 2,
      title: "Apprentissage et conseils",
      description: "Conception d'applications mobiles innovantes.",
      image: imageCardLearning,
      category: "apprentissage"
    },
    {
      id: 3,
      title: "IoT & Hardware",
      description: "Solutions matérielles et connectées sur mesure.",
      image: imageCardHardware,
      category: "hardware"
    }
  ]);

  // Données pour le carrousel d'avis
  const [reviews] = useState([
    { id: 1, author: "Margaux B.", text: "Seconde fois que je fais appel à ses services...", service: "Hardware & Software", photo: image1 },
    { id: 2, author: "Doudou", text: "Très satisfait du montage du pc.", service: "Hardware & Software", photo: image2 },
    { id: 3, author: "Louis B.", text: "Top tout fonctionne rien a redire.", service: "Hardware", photo: image3 },
    { id: 4, author: "Clara", text: "J'avais besoin de conseils pour configurer mon pc...", service: "Hardware & Conseils", photo: image4 },
    { id: 5, author: "TikTak58", text: "Setup gaming ajusté selon mon budget. Top !", service: "Hardware & Software & Conseils", photo: image6 },
    { id: 6, author: "BoB", text: "Configuration efficace avec un petit budget.", service: "Conseils", photo: image7 },
    { id: 7, author: "Sylvie M.", text: "Très satisfaite de l'installation.", service: "Hardware & Conseils", photo: image8 },
    { id: 8, author: "Ahurit71", text: "Le pc tourne du feu de dieu.", service: "Hardware & Conseils", photo: image9 },
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

  // Offset vertical (déplacé via scroll) et horizontal (déplacé via la souris)
  const [bgOffset, setBgOffset] = useState(0);
  const [fgOffset, setFgOffset] = useState(0);
  const [fgOffsetX, setFgOffsetX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setBgOffset(window.pageYOffset * 0.01); // Couche de fond se déplace lentement
      setFgOffset(window.pageYOffset * 0.1); // Couche de premier plan se déplace plus vite (vertical)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion du mouvement de la souris sur la section hero pour un effet horizontal
  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = e.clientX - centerX;
    // Appliquer un coefficient pour l'effet horizontal (ajustez selon vos préférences)
    setFgOffsetX(deltaX * 0.03);
  };

  return (
    <>
      {/* Section Hero avec double parallax (vertical via scroll et horizontal via souris) */}
      <div className="hero-container" onMouseMove={handleMouseMove}>
        {/* La couche de fond est gérée par le background CSS ou un composant séparé */}
        {/* Couche de premier plan : image profil avec décalage vertical et horizontal */}
        <img
          src={profil}
          alt="Profil"
          className="home-image"
          loading="lazy"
          style={{ transform: `translate(${fgOffsetX}px, ${fgOffset}px) scale(1.0)` }}
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

      {/* Section Cartes de Prestations */}
      <section className="cards-section">
        {cards.map(card => (
          <Link 
            key={card.id} 
            to={`/projets?cat=${card.category}`} 
            className="card-link"
          >
            <TiltCard>
              <div className="card">
                <img src={card.image} alt={card.title} className="card-image" loading="lazy" />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </TiltCard>
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
                    <img
                      src={review.photo}
                      alt={review.author}
                      loading="lazy"
                    />
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
