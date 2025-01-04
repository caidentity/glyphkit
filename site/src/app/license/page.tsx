import React from 'react';
import './license.scss';
import Footer from '@/components/Footer/Footer';

export default function LicensePage() {
  return (
    <main className="license-page">
      <div className="content-section">
        <div className="container">
          <h1>GlyphKit Terms of Use</h1>
          <p className="intro">
            These terms ("Agreement") govern the use of the GlyphKit icon library and related resources 
            provided by Interact LLC, a Montana company ("the Company"). By downloading or using GlyphKit, 
            you ("the User") agree to these terms.
          </p>

          <h2>On This Page</h2>
          <ul className="toc">
            <li><a href="#background">Background</a></li>
            <li><a href="#ownership">Ownership and Usage Rights</a></li>
            <li><a href="#brand-icons">Brand Icons</a></li>
            <li><a href="#updates">Updates and Maintenance</a></li>
            <li><a href="#limitations">Limitations of Use</a></li>
            <li><a href="#disclaimer">Disclaimer</a></li>
            <li><a href="#general-terms">General Terms</a></li>
          </ul>

          <section id="background">
            <h2>Background</h2>
            <p>
              GlyphKit is an icon library and toolkit developed and owned by Interact LLC. 
              GlyphKit is made available for public use, supporting creative, commercial, 
              and non-commercial projects under the terms outlined below.
            </p>
          </section>

          <section id="ownership">
            <h2>Ownership and Usage Rights</h2>
            <ul>
              <li>Ownership: All GlyphKit icons, tools, and resources ("Content") are the intellectual property of Interact LLC.</li>
              <li>Open Use: Users are granted a non-exclusive, worldwide, royalty-free right to use, modify, and distribute the Content in their projects.</li>
              <li>Attribution: While not required, attribution to GlyphKit is encouraged when feasible.</li>
            </ul>
          </section>

          <section id="brand-icons">
            <h2>Brand Icons</h2>
            <ul>
              <li>Brand icons included in GlyphKit are trademarks of their respective owners.</li>
              <li>Use of brand icons must comply with the brand's own guidelines and must only represent the corresponding company, product, or service.</li>
              <li>GlyphKit's inclusion of brand icons does not imply endorsement or affiliation.</li>
            </ul>
          </section>

          <section id="updates">
            <h2>Updates and Maintenance</h2>
            <ul>
              <li>Interact LLC may release updates, enhancements, or additional icons to GlyphKit at its discretion.</li>
              <li>Users are encouraged to use the latest version of GlyphKit to access new features and ensure compatibility.</li>
              <li>GlyphKit reserves the right to modify or discontinue updates at any time without notice.</li>
            </ul>
          </section>

          <section id="limitations">
            <h2>Limitations of Use</h2>
            <h3>Prohibited Actions:</h3>
            <ul>
              <li>Users may not claim ownership of GlyphKit Content or portray it as their creation.</li>
              <li>Redistribution of the Content in standalone form (e.g., as an icon library or asset pack) is prohibited.</li>
              <li>Compliance: Users must comply with all applicable laws and regulations when using GlyphKit.</li>
            </ul>
          </section>

          <section id="disclaimer">
            <h2>Disclaimer</h2>
            <ul>
              <li>The GlyphKit Content is provided "as is" without any warranties, express or implied.</li>
              <li>Interact LLC disclaims all liability for any damages arising from the use or inability to use GlyphKit, including but not limited to direct, indirect, or consequential damages.</li>
            </ul>
          </section>

          <section id="general-terms">
            <h2>General Terms</h2>
            <ul>
              <li>Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of Montana, without regard to conflict of laws principles.</li>
              <li>Severability: If any provision of this Agreement is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.</li>
              <li>Amendments: Interact LLC reserves the right to modify these terms at any time. Continued use of GlyphKit after changes are made constitutes acceptance of the updated terms.</li>
            </ul>
          </section>

          <section id="questions">
            <h2>Questions</h2>
            <p>
              For inquiries or further information, please contact Interact LLC at{' '}
              <a href="mailto:support@glyphkit.com">support@glyphkit.com</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
} 