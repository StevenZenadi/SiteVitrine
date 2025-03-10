// src/components/PageTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: -50 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
