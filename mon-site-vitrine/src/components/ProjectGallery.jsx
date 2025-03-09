// src/components/ProjectGallery.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProjectGallery.css';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className="slick-arrow slick-next" onClick={onClick}>
      &rarr;
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="slick-arrow slick-prev" onClick={onClick}>
      &larr;
    </div>
  );
}

function ProjectGallery({ media = [] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
  };

  return (
    <div className="project-gallery">
      <Slider {...settings}>
        {media.map((item, index) => {
          let type, src, caption, poster;
          if (typeof item === 'object' && item !== null && item.src) {
            type = item.type || 'image';
            src = item.src;
            caption = item.caption;
            poster = item.poster;
          } else {
            type = 'image';
            src = item;
            caption = '';
          }
          return (
            <div key={index} className="gallery-slide">
              {type === 'video' ? (
                <video controls width="100%" poster={poster || ''}>
                  <source src={src} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              ) : (
                <img src={src} alt={`Slide ${index + 1}`} />
              )}
              {caption && <p className="slide-caption">{caption}</p>}
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default ProjectGallery;
