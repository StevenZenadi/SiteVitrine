// src/contexts/ProjectCategoryContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ProjectCategoryContext = createContext();

export const ProjectCategoryProvider = ({ children }) => {
  // Par défaut, on part sur "software"
  const [projectCategory, setProjectCategory] = useState("software");
  return (
    <ProjectCategoryContext.Provider value={{ projectCategory, setProjectCategory }}>
      {children}
    </ProjectCategoryContext.Provider>
  );
};

export const useProjectCategory = () => useContext(ProjectCategoryContext);

export default ProjectCategoryContext;
