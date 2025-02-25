// src/components/Breadcrumbs.jsx
import React from 'react';
import './Breadcrumbs.css';

function Breadcrumbs({ segments = [] }) {
  return (
    <nav className="breadcrumbs">
      {segments.map((seg, index) => (
        <span key={index}>
          {seg}
          {index < segments.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
