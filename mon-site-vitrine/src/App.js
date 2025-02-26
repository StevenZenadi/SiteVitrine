// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';

// Import des pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Jeux from './pages/Games';
import PageTransition from './components/PageTransition';
import { ProjectCategoryProvider } from './contexts/ProjectCategoryContext';
import Preloader from './components/Preloader';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/projets" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/jeux" element={<PageTransition><Jeux /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="*" element={<PageTransition><Home /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <ProjectCategoryProvider>
        {loading && <Preloader onFinish={() => setLoading(false)} />}
        <div className="app-container">
          <Router>
            <Header />
            <div className="header-placeholder"></div>
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
          </Router>
        </div>
      </ProjectCategoryProvider>
    </>
  );
}

export default App;



{/*
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

// Import des pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Player from "./components/Player";
import Jeux from './pages/Games';

import './App.css';

function App() {
  return (
    <BrowserRouter basename="/SiteVitrine">
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jeux" element={<Jeux />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
*/}

