import React from 'react';
import { Icon } from '../../src/components/Icon';
import { DEBUG_ICONS } from './debug';
import './App.css';

export function App() {
  return (
    <div className="demo-container">
      <header>
        <h1>GlyphKit Icons</h1>
        <p>Total Icons: {DEBUG_ICONS.length}</p>
      </header>

      <main className="icon-grid">
        {DEBUG_ICONS.map(name => (
          <div key={name} className="icon-wrapper">
            <div className="icon-display">
              <Icon 
                name={name}
                size={24}
                className="demo-icon"
                color='#ccc'
                onError={(error) => {
                  console.error(`Failed to load icon ${name}:`, error);
                }}
              />
            </div>
            <code className="icon-name">{name}</code>
          </div>
        ))}
      </main>
    </div>
  );
} 