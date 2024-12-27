'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';
import SearchBar from './SearchBar';
import LogoSection from './LogoSection';

const Masthead = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className="masthead">
      <div className="masthead-background">
        <BackgroundPattern isVisible={isVisible} />
      </div>
      <div className="masthead-overlay"/>
      <div className="masthead-content">
        <div className="content-wrapper">
          <LogoSection isVisible={isVisible} />
          <SearchBar isVisible={isVisible} />
        </div>
      </div>
    </header>
  );
};

export default Masthead; 