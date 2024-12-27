import React from 'react';
import dynamic from 'next/dynamic';
import './styling/Homepage.scss';

const Masthead = dynamic(() => import('./Masthead'), {
  ssr: false
});

export default function Homepage() {
  return (
    <div className="homepage">
      <Masthead />
      <main className="main-content">
        <div className="container">
          <h1>Welcome</h1>
          <p>Your content goes here...</p>
        </div>
      </main>
    </div>
  );
} 