import React from 'react';
import './TestimonialsCarousel.css';

import image1 from '../images/1.0.webp';
import image2 from '../images/2.webp';
import image3 from '../images/3.webp';
import image4 from '../images/4.webp';
import image6 from '../images/6.webp';
import image7 from '../images/7.webp';
import image8 from '../images/8.webp';
import image9 from '../images/9.webp';

function TestimonialsCarousel() {
  const testimonials = [
    { text: "Steven est un développeur passionné et créatif.", author: "Alice" },
    { text: "J'adore collaborer avec lui, il apporte toujours des idées innovantes.", author: "Bob" },
    { text: "Son travail allie technicité et humanité.", author: "Claire" },
  ];

  return (
    <div className="testimonials-carousel">
      {testimonials.map((item, index) => (
        <div key={index} className="testimonial">
          <p className="testimonial-text">"{item.text}"</p>
          <p className="testimonial-author">- {item.author}</p>
        </div>
      ))}
    </div>
  );
}

export default TestimonialsCarousel;
