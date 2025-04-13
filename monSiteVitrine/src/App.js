// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Jeux from './pages/Games';
import PageTransition from './components/PageTransition';
import { ProjectCategoryProvider } from './contexts/ProjectCategoryContext';
import Preloader from './components/Preloader';
import './App.css';

function AnimatedRoutes({ apiStatus, onApiOnline }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Home apiStatus={apiStatus} onApiOnline={onApiOnline} />
            </PageTransition>
          }
        />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/projets" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/jeux" element={<PageTransition><Jeux /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact apiStatus={apiStatus} onApiOnline={onApiOnline}/></PageTransition>} />
        <Route 
          path="*" 
          element={
            <PageTransition>
              <Home apiStatus={apiStatus} onApiOnline={onApiOnline} />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // État global de l'API : "loading" => on attend que CommentsSection la valide
  const [apiStatus, setApiStatus] = useState("loading");

  // Callback appelé lorsque CommentsSection récupère enfin des données valides
  const handleApiOnline = () => {
    setApiStatus("online");
  };

  return (
    <ProjectCategoryProvider>
      <div className="app-container">
        <Router>
          <Header apiStatus={apiStatus} />
          <div className="header-placeholder"></div>
          <main>
            <AnimatedRoutes 
              apiStatus={apiStatus} 
              onApiOnline={handleApiOnline} 
            />
          </main>
          <Footer />
        </Router>
      </div>
    </ProjectCategoryProvider>
  );
}

export default App;
