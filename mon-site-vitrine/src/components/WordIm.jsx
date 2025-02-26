// src/components/WordIm.jsx
import React from 'react';
import './WordIm.css';

const WordIm = () => {
  return (
    <div className="word-im">
      <span className="bar i"></span>
      <span className="apostrophe"></span>
      <div className="m-container">
        <span className="bar m1"></span>
        <span className="bar m2"></span>
        <span className="bar m3"></span>
      </div>
    </div>
  );
};

export default WordIm;
