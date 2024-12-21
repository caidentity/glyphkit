import React from 'react';
import { Icon } from '../../src';
import './App.css';

export function App() {
  return (
    <div className="demo-container">
      <h1>Glyphkit Demo</h1>
      <div className="icon-grid">
        <Icon 
          name="arrow" 
          size={24} 
          color="#1a73e8" 
          aria-label="Small blue arrow"
          onError={(error) => console.error(error)}
        />
        <Icon 
          name="arrow" 
          size={32} 
          color="#d93025"
          aria-label="Medium red arrow"
          onError={(error) => console.error(error)}
        />
        <Icon 
          name="arrow" 
          size={48} 
          color="#188038"
          aria-label="Large green arrow"
          onError={(error) => console.error(error)}
        />
      </div>
    </div>
  );
} 