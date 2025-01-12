'use client';

import './Footer.scss';
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';

const Footer = () => {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Releases', href: '/releases' },
    { label: 'About', href: '/about' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'License', href: '/license' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <nav className="footer__nav">
          <ul className="footer__links">
            {links.map((link) => (
              <li key={link.label} className="footer__link-item">
                <a href={link.href} className="footer__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__right">
          <span className="footer__copyright">
            © {new Date().getFullYear()} Interact LLC
          </span>
          <a href="https://x.com/glyphkit" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <GlyphKitIcon name="brand_twitter_16" size={18} color="var(--text-tertiary)" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
