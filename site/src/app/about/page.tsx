import React from 'react';
import Image from 'next/image';
import '@/styles/about.scss';

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="hero-section">
        <div className="container">
          <Image
            src="/path-to-your-image.jpg" // You'll need to add your image
            alt="Glyphkit Hero"
            width={1200}
            height={400}
            className="hero-image"
            priority
          />
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <h1>About Glyphkit</h1>
          
          <div className="description">
            <p>
              Glyphkit is a comprehensive icon toolkit designed to provide developers 
              and designers with a versatile collection of high-quality icons for modern 
              web applications.
            </p>

            <h2>Our Mission</h2>
            <p>
              We aim to simplify the process of implementing consistent, scalable, 
              and accessible icons across digital projects. Our library offers a carefully 
              curated selection of icons in multiple sizes and styles, ensuring flexibility 
              and consistency in your designs.
            </p>

            <h2>Features</h2>
            <ul>
              <li>Comprehensive icon collection</li>
              <li>Multiple size variants (16px, 24px)</li>
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