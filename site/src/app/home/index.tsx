import React from 'react';
import dynamic from 'next/dynamic';
import KitsSection from './KitsSection';
import Footer from '@/components/Footer/Footer';
import './styling/Homepage.scss';

const Masthead = dynamic(() => import('./Masthead'), {
  ssr: false
});

export default function Homepage() {
  return (
    <div className="homepage">
      <Masthead />
      <KitsSection />
      <Footer/>
    </div>
  );
} 