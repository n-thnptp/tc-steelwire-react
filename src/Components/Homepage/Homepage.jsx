// src/components/Homepage.jsx
import React from 'react';
import Navbar from './Navbar';
import PCStrand from './PCStrand';
import PCWire from './PCWire';
import Contact from './Contact';

const Homepage = () => {
  return (
    <div>
      <Navbar />
      
      {/* Wrapper for all components */}
      
        <PCStrand />
        <PCWire />
        <Contact />
      
    </div>
  );
};

export default Homepage;
