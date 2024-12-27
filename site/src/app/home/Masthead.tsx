'use client';

import React, { useState, useEffect } from 'react';
import BackgroundPattern from './BackgroundPattern';
import SearchBar from './SearchBar';
import LogoSection from './LogoSection';

const Masthead = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className={`masthead ${isTransitioning ? 'transitioning' : ''}`}>
      <BackgroundPattern isVisible={isVisible} />
      <div className="masthead-overlay"/>
      <div className="masthead-content">
        <div className="content-wrapper">
          <LogoSection isVisible={isVisible} />
          <SearchBar 
            isVisible={isVisible} 
            onTransitionStart={() => setIsTransitioning(true)}
          />
        </div>
      </div>
    </header>
  );
};

export default Masthead; 