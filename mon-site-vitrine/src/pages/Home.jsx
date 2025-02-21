// src/pages/Home.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import logo from '../images/home2.webp';

function Home() {
  // Données pour les cartes de prestations
  const [cards] = useState([
    {
      id: 1,
      title: "Développement Web",
      description: "Création de sites web responsives et performants.",
      image: "/images/card-web.jpg"
    },
    {
      id: 2,
      title: "Applications Mobiles",
      description: "Conception d'applications mobiles innovantes.",
      image: "/images/card-mobile.jpg"
    },
    {
      id: 3,
      title: "IoT & Hardware",
      description: "Solutions matérielles et connectées sur mesure.",
      image: "/images/card-iot.jpg"
    }
  ]);

  // Données pour le carrousel d'avis (reste inchangé)
  const [reviews] = useState([
    {
      id: 1,
      author: "Alice",
      text: "Excellent travail, merci !",
      service: "Plomberie",
      photo: "/images/charlie.jpg",
    },
    {
      id: 2,
      author: "Bob",
      text: "Très satisfait de l'installation électrique.",
      service: "Électricité",
      photo: "/images/charlie.jpg",
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
          src={logo}
          alt="Illustration de mon domaine d'activité"
          className="hero-image"
        />
        {/* Overlay pour atténuer les bords */}
        <div className="hero-overlay"></div>
        {/* Zone de texte (si nécessaire) */}
        <div className="hero-text">
          <h1>Bienvenue sur mon site</h1>
          <p>Découvrez mes compétences et projets.</p>
        </div>
      </div>

      {/* Divider : espace blanc pour séparation */}
      <div className="divider"></div>

      {/* Section Cartes de Prestations */}
      <section className="cards-section">
        {cards.map(card => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.title} className="card-image" />
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
              <div key={review.id} className="review" style={{ padding: "1rem", display: "flex", alignItems: "center" }}>
                <img
                  src={review.photo}
                  alt={review.author}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "1rem"
                  }}
                />
                <div>
                  <p style={{ fontStyle: "italic" }}>"{review.text}"</p>
                  <p style={{ marginTop: "0.5rem", color: "#555" }}>
                    <strong>- {review.author}</strong> <br />
                    Service : <strong>{review.service}</strong>
                  </p>
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
