// Scene3D.jsx
import iutDijon from "../ressources/retravailiut.gltf";

import React from 'react';

const GLTFViewer = ({ src, alt = "Modèle 3D", style, ...props }) => {
  return (
    <model-viewer
      src={iutDijon}
      alt={alt}
      auto-rotate
      camera-controls
      style={style || { width: "100vw", height: "100vh" }}
      {...props}
    />
  );
};

export default GLTFViewer;

