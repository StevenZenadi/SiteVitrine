// src/pages/Home.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  // ----------------------------------
  // 1) State pour le fil d’actualité
  // (Optionnel, pas au cœur de la question, mais gardé pour le contexte)
  // ----------------------------------
  const [posts] = useState([
    {
      id: 1,
      image: "/images/post1.jpg",
      description: "Prototype en cours...",
      date: "2025-03-01"
    },
    {
      id: 2,
      image: "/images/post2.jpg",
      description: "Installation terminée avec succès !",
      date: "2025-03-02"
    }
  ]);

  // ----------------------------------
  // 2) State pour les avis
  // ----------------------------------
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

  // ----------------------------------
  // 3) Gérer le formulaire d’avis
  // ----------------------------------

  // ----------------------------------
  // 4) Configuration du carrousel
  // ----------------------------------
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


  // ----------------------------------
  // Rendu (JSX)
  // ----------------------------------
  return (
    <div className="home-container" style={{ padding: "1rem" }}>
      {/* Fil d'actualité (optionnel) */}
      <section className="feed-section">
        <h2>Mon fil d'actualité</h2>
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post.id} className="post-item" style={{ marginBottom: "2rem" }}>
              <img
                src={post.image}
                alt={post.description}
                style={{ width: "100%", maxWidth: "400px", display: "block" }}
              />
              <p>{post.description}</p>
              <small>Publié le {post.date}</small>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      {/* Carrousel d'avis */}
      <section className="reviews-section">
        <h2>Avis des clients</h2>

        <div className="reviews-carousel" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Slider {...sliderSettings}>
            {reviews.map((review) => (
              <div key={review.id} style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}></div>
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
    </div>
  );
}

export default Home;
