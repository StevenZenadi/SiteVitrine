// Scene3D.jsx
import iutDijon from "../ressources/IUTDijon3D-optimized.glb";

import React from 'react';

const GLTFViewer = ({ src, alt = "Modèle 3D", style, ...props }) => {
  return (
    <model-viewer
      src={iutDijon}
      alt={alt}
      auto-rotate
      camera-controls
      style={style || { width: "100%", height: "500px" }}
      {...props}
    />
  );
};

export default GLTFViewer;

