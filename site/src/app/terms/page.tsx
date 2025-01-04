import React from 'react';
import './terms.scss';
import Footer from '@/components/Footer/Footer';

export default function TermsPage() {
  return (
    <main className="terms-page">
      <div className="content-section">
        <div className="container">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: February 2, 2024</p>
          
          <p>
            By using the glyphkit.com website ("Service"), or any services of GlyphKit ("GlyphKit"), 
            you (the user of the Service, such user's successors, agents, and assigns, and everyone 
            in privity with such user are, hereafter, "You." Together, You and GlyphKit are 
            sometimes the "parties") are agreeing to be bound by the following terms and conditions 
            ("Terms of Service").
          </p>

          <h2>Table of Contents</h2>
          <ul className="toc">
            <li><a href="#account-terms">Account Terms</a></li>
            <li><a href="#cancellation">Cancellation & Termination</a></li>
            <li><a href="#modifications">Modifications to the Service</a></li>
            <li><a href="#copyright">Copyright and Content Ownership</a></li>
            <li><a href="#conditions">General Conditions</a></li>
          </ul>

          <section id="account-terms">
            <h2>Account Terms</h2>
            <ul>
              <li>You must be 13 years or older to use this Service.</li>
              <li>You must be a human. Accounts registered by "bots" or other automated methods are not permitted.</li>
              <li>You must provide your name, a valid email address, and any other information requested in order to complete the registration process.</li>
              <li>Your login may only be used by one person - i.e., a single login may not be shared by multiple people - except that a machine user's actions may be directed by multiple people.</li>
              <li>You are responsible for maintaining the security of your account and password. GlyphKit cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>One person or legal entity may not maintain more than one free account, and one machine user account that is used exclusively for performing automated tasks.</li>
              <li>You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).</li>
              <li>Your use of the Service is conditioned upon your payment of certain fees to GlyphKit (the "User Fees"). Such User Fees are specifically set forth at glyphkit.com/plans. You shall pay the applicable User Fee to GlyphKit as a strict condition of these Terms of Service.</li>
            </ul>
          </section>

          <section id="cancellation">
            <h2>Cancellation & Termination</h2>
            <ul>
              <li>You are solely responsible for properly canceling your account. You can cancel your account at any time by emailing support@glyphkit.com</li>
              <li>All of your Content will be immediately deleted from the Service upon cancellation. This information cannot be recovered once your account is canceled.</li>
              <li>GlyphKit, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service for any reason at any time.</li>
              <li>In the event that GlyphKit takes action to suspend or terminate an account, we will make a reasonable effort to provide the affected account owner with a copy of their account contents upon request, unless the account was suspended or terminated due to unlawful conduct.</li>
            </ul>
          </section>

          <section id="modifications">
            <h2>Modifications to the Service</h2>
            <ul>
              <li>GlyphKit reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</li>
              <li>GlyphKit shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</li>
            </ul>
          </section>

          <section id="copyright">
            <h2>Copyright & Content Ownership</h2>
            <ul>
              <li>GlyphKit does not pre-screen Content, but GlyphKit and its designee have the right (but not the obligation) in their sole discretion to refuse or remove any Content that is available via the Service.</li>
              <li>The look and feel of the Service is copyright © GlyphKit. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements or concepts without express written permission from GlyphKit.</li>
            </ul>
          </section>

          <section id="conditions">
            <h2>General Conditions</h2>
            <ul>
              <li>Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.</li>
              <li>Support for GlyphKit services is only available in English, via email.</li>
              <li>You understand that GlyphKit uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.</li>
              <li>You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service or GlyphKit.</li>
              <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by GlyphKit.</li>
              <li>We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</li>
              <li>Verbal, physical, written or other abuse (including threats of abuse or retribution) of any GlyphKit customer, employee, member, or officer will result in immediate account termination.</li>
            </ul>
          </section>

          <section id="contact">
            <h2>Contact</h2>
            <p>Questions about the Terms of Service should be sent to support@glyphkit.com</p>
          </section>
        </div>
      </div>
      <Footer/>
    </main>
  );
} 