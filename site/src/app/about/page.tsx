import React from 'react';
import './about.scss';
import Image from '@/components/Image/Image';

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="hero-section">
          <Image
            src="/assets/about/about_header.jpg" // You'll need to add your image
            alt="Glyphkit Hero"
            width={1200}
            height={400}
            className="hero-image"
            priority
          />
      </div>
      
      <div className="content-section">
        <div className="container">
          <h1>About Glyphkit</h1>
          
          <div className="description">
            <p>
              GlyphKit is a comprehensive icon toolkit designed to bring quality to any application. 
            </p>

            <h2>Design Philosphy</h2>
            <p>
              Eaach icon is carefully designed to uphold a high level of accessibility, readability and conformance to any design language.
            </p>
            <p>
              Styling is kept a  minimum in order to bring conformance to any existing design language. This library will continue to evolve over time and support more mechinims to control styling in order to ensure a even closer fit to your existing design language. 
            </p>


            <h2>Features</h2>
            <ul>
              <li>Comprehensive icon collection containing over 1000+ icons</li>
              <li>Multiple sizes avaliable (16px, 24px)</li>
              <li>Consistent design language</li>
              <li>Easy integration</li>
              <li>Regular updates and additions</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 