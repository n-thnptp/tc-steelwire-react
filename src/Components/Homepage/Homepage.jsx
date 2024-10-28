// src/components/Homepage.jsx
import React from 'react';
import PCStrand from './PCStrand';
import PCWire from './PCWire';
import Contact from './Contact';

const Homepage = () => {
    return (
        <div className="snap-y snap-mandatory h-[calc(100dvh-4rem)] overflow-y-scroll">
            {/* <Navbar /> */}

            {/* Wrapper for all components */}

            <PCStrand />
            <PCWire />
            <Contact />

        </div>
    );
};

export default Homepage;
