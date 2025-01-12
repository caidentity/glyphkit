import React from 'react';
import './license.scss';
import Footer from '@/components/Footer/Footer';
import '@/styles/pages/infopages.scss';
import FloatingTOC from '@/components/FloatingTOC/FloatingTOC';

const tocItems = [
  { href: '#information', text: 'Information We Collect' },
  { href: '#tools-services', text: 'Tools and Services' },
  { href: '#rights', text: 'Your Rights and Choices' },
  { href: '#data-processing', text: 'Data Processing Information' },
  { href: '#cookies', text: 'Cookie Management' },
  { href: '#contact', text: 'Contact Us' },
  { href: '#changes', text: 'Changes to This Notice' }
];

export default function LicensePage() {
  return (
    <main className="license-page">
      <div className="page-masthead">
        <h1>Privacy Notice</h1>
      </div>

      <div className="info-page-wrapper">
        <div className="content-container">
          <p className="last-updated">Last Updated: January 11, 2025</p>

          <p className="intro">
            We are committed to protecting your privacy and ensuring transparency about how we collect and use your information. 
            This Privacy Notice explains our practices regarding data collection and processing when you use our website.
          </p>

          <section id="information">
            <h2>Information We Collect</h2>
            <p>When you visit our website, we automatically collect certain information about your device and how you interact with our site. This includes:</p>
            <ul>
              <li>IP addresses (anonymized)</li>
              <li>Browser type and version</li>
              <li>Device type and screen size</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referral sources</li>
            </ul>
          </section>

          <section id="tools-services">
            <h2>Tools and Services</h2>
            <p>We use various tools and services to host, maintain, and analyze our website. Here's information about our key service providers:</p>

            <div id="vercel" className="subsection">
              <h3>Vercel Hosting</h3>
              <p>Our website is hosted on Vercel, a cloud platform for frontend applications. Vercel collects and processes certain technical data to provide us with essential hosting services:</p>
              <ul>
                <li>Server logs for security and performance monitoring</li>
                <li>Basic analytics about website performance and reliability</li>
                <li>Technical information required for content delivery</li>
              </ul>
              <p>Vercel's processing of this information is governed by their privacy policy, which you can find at <a href="https://vercel.com/legal/privacy-policy">https://vercel.com/legal/privacy-policy</a>.</p>
            </div>

            <div id="analytics" className="subsection">
              <h3>Google Analytics</h3>
              <p>We use Google Analytics to understand how visitors interact with our website. This service helps us improve our content and user experience by providing insights about:</p>
              <ul>
                <li>How you found our website</li>
                <li>Which pages you visit</li>
                <li>How long you spend on different pages</li>
                <li>What actions you take on our site</li>
              </ul>
              
              <p>Google Analytics uses cookies and similar technologies to collect this information. We have configured Google Analytics to:</p>
              <ul>
                <li>Anonymize IP addresses before storage</li>
                <li>Respect "Do Not Track" browser settings</li>
                <li>Delete user data after 26 months</li>
              </ul>
            </div>
          </section>

          <section id="rights">
            <h2>Your Rights and Choices</h2>
            <p>You have several rights regarding your personal information:</p>
            <ul>
              <li>Access: Request a copy of your data</li>
              <li>Correction: Ask us to correct inaccurate data</li>
              <li>Deletion: Request removal of your data</li>
              <li>Opt-out: Control cookie preferences through your browser settings</li>
            </ul>
          </section>

          <section id="data-processing">
            <h2>Data Processing Information</h2>
            <p>Personal data is any information relating to an identified or identifiable individual. This includes:</p>
            <ul>
              <li>Names and contact information</li>
              <li>Date of birth</li>
              <li>Email addresses</li>
              <li>Postal addresses</li>
              <li>Telephone numbers</li>
              <li>Online identifiers (such as IP addresses)</li>
            </ul>
            
            <p>Information of a general nature that cannot be used to determine your identity (such as anonymous usage statistics) is not considered personal data.</p>
          </section>

          <section id="cookies" className="enhanced-section">
            <h2>Cookie Management and Types</h2>
            
            <h3>What Are Cookies?</h3>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide essential features and improve your experience.</p>

            <h3>Cookie Categories</h3>
            <div className="cookie-types">
              <h4>Essential Cookies</h4>
              <p>These cookies are necessary for the website to function properly and cannot be disabled. They don't store any personally identifiable information.</p>

              <h4>Functional Cookies</h4>
              <p>These cookies enable enhanced functionality and personalization, such as:</p>
              <ul>
                <li>Remembering your preferences</li>
                <li>Storing your selected settings</li>
                <li>Customizing your experience</li>
              </ul>

              <h4>Analytics Cookies</h4>
              <p>These cookies help us understand how visitors interact with our website by:</p>
              <ul>
                <li>Collecting anonymous usage statistics</li>
                <li>Monitoring website performance</li>
                <li>Tracking user journeys through the site</li>
              </ul>

              <h4>Advertising Cookies</h4>
              <p>These cookies are used to deliver personalized advertising. They require explicit consent before activation.</p>
            </div>

            <h3>Cookie Duration</h3>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period</li>
            </ul>

            <h3>Legal Basis</h3>
            <p>We process your data in accordance with:</p>
            <ul>
              <li>Your consent (Art. 6 para. 1 lit. a GDPR)</li>
              <li>Contract fulfillment (Art. 6 para. 1 lit. b GDPR)</li>
              <li>Legal obligations (Art. 6 para. 1 lit. c GDPR)</li>
              <li>Legitimate interests (Art. 6 para. 1 lit. f GDPR)</li>
            </ul>

            <h3>Cookie Management</h3>
            <p>You can manage your cookie preferences through:</p>
            <ul>
              <li>Our cookie consent banner</li>
              <li>Your browser settings</li>
              <li>Individual opt-out mechanisms for specific services</li>
            </ul>
          </section>

          <section id="contact">
            <h2>Concerns and Contact</h2>
            <p>
              If you have any concerns about a possible compromise of your privacy, 
              misuse of your personal information, questions about this Privacy Notice, 
              or wish to enforce your privacy rights, please don't hesitate to reach out. 
              We take all privacy matters seriously and will address your concerns promptly 
              and thoroughly.
            </p>
            <p>
              You can contact our privacy team directly at:
              <br />
              <a href="mailto:support@glyphkit.com">support@glyphkit.com</a>
            </p>
          </section>

          <section id="changes">
            <h2>Changes and Updates to the Privacy Notice</h2>
            <p>We kindly ask you to regularly review the content of our Privacy Notice. We will amend this Notice as soon as changes to our information processing activities make this necessary.</p>
            
            <p>We will specifically inform you when changes require:</p>
            <ul>
              <li>An act of cooperation on your part (e.g., consent)</li>
              <li>Other individual notification</li>
              <li>Review of your current privacy choices</li>
            </ul>

            <p>All updates will be posted on this page with a new "Last Updated" date.</p>
            
            <p className="last-updated"><strong>Last Updated:</strong> January 11th, 2025</p>
          </section>
        </div>
        
        <FloatingTOC items={tocItems} />
      </div>
      
      <Footer />
    </main>
  );
} 