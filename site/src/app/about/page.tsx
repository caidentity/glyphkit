import React from 'react';
import './about.scss';
import Image from '@/components/Image/Image';
import Footer from '@/components/Footer/Footer';

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

            <h2>Our Vision</h2>
            <p>
              We envision a future where developers and designers no longer struggle to find the perfect icon system for their applications. GlyphKit aims to be the definitive solution by providing a robust, cohesive icon system that seamlessly integrates with any design language or application framework.
            </p>
            <p>
              Our mission is to fill a critical gap in the icon library ecosystem by offering unparalleled flexibility, comprehensive coverage, and developer-first tooling. We believe that icons should not only look beautiful but also be effortless to implement and customize.
            </p>

            <h2>Design Philosophy</h2>
            <p>
              Each icon is carefully designed to uphold a high level of accessibility, readability and conformance to any design language.
            </p>
            <p>
              Styling is kept at a minimum in order to bring conformance to any existing design language. This library will continue to evolve over time and support more mechanisms to control styling in order to ensure an even closer fit to your existing design language. 
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
      <Footer/>
    </main>
  );
} 