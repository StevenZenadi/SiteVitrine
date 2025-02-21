// src/pages/Home.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import mainImage from '../images/home2.webp';
import imageCardSoftware from '../images/card_software.webp';
import image1 from '../images/1.0.webp';
import image11 from '../images/1.1.webp';
import image2 from '../images/2.webp';
import image21 from '../images/2.1.webp';
import image3 from '../images/3.webp';
import image31 from '../images/3.1.webp';
import image4 from '../images/4.webp';
import image6 from '../images/6.webp';
import image7 from '../images/7.webp';
import imageCardLearning from '../images/card_learning.webp';
import imageCardHardware from '../images/card_hardware.webp';

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

  // Données pour le carrousel d'avis (reste inchangé)
  const [reviews] = useState([
    {
      id: 1,
      author: "Alice",
      text: "Excellent travail, merci !",
      service: "Plomberie",
      photo: image1,
    },
    {
      id: 2,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: image2,
    },
    {
      id: 3,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: image3,
    },
    {
      id: 4,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: image4,
    },
    {
      id: 5,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: image6,
    },
    {
      id: 6,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: image7,
    },
  ]);

  // Configuration du carrousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };

  return (
    <>
      {/* Section Hero : Image pleine largeur 
      <section className="hero-section">
        <img 
          src={logo}
          alt="Illustration de mon domaine d'activité" 
          className="hero-image" 
        />
      </section>*/}
      <div className="hero-container">
        <img
          src={mainImage}
          alt="Illustration de mon domaine d'activité"
          className="hero-image"
          loading="lazy"
        />
        {/* Overlay pour atténuer les bords */}
        <div className="hero-overlay"></div>
        {/* Zone de texte (si nécessaire) */}
        <div className="hero-text">
          <h1>Bienvenue sur mon site la calotte de tes morts</h1>
          <p>Découvrez mes compétences et projets.</p>
        </div>
      </div>

      {/* Divider : espace blanc pour séparation */}
      <div className="divider"></div>

      {/* Section Cartes de Prestations */}
      <section className="cards-section">
        {cards.map(card => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.title} className="card-image" loading="lazy" />
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
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
