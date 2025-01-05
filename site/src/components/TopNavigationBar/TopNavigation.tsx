'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './TopNavigation.scss';
import { Icon } from '@glyphkit/glyphkit';
import Image from 'next/image';
import { getLogoPath } from '@/lib/assetLoader'
import Button from '@/components/Button/Button';

const navigation = [
  { name: 'Icons', href: '/icons' },
  { name: 'Docs', href: '/docs' },
  { name: 'Feedback', href: 'https://github.com/GlyphKit/glyphkit/issues/new/choose' },
];

export default function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();
  const logoPath = getLogoPath('logo.svg')

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handle mobile menu animations
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="top-navigation">
      {/* Mobile Menu Overlay */}
      <div className={`top-navigation__mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="top-navigation__mobile-links">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`top-navigation__mobile-link ${pathname === item.href ? 'active' : ''}`}
              style={{
                transitionDelay: mobileMenuOpen ? `${(index + 1) * 100}ms` : '0ms',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <nav className="top-navigation__container">
        <div className="top-navigation__content">
          {/* Logo */}
          <Link href="/" className="top-navigation__logo">
            <Image src={logoPath} alt="Logo" width={40} height={40} priority />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="top-navigation__links">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`top-navigation__link ${
                  pathname === item.href ? 'top-navigation__link--active' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="top-navigation__actions">
            <Button
              variant="tertiary"
              size="md"
              onClick={() => window.open('https://www.npmjs.com/package/@glyphkit/glyphkit', '_blank', 'noopener noreferrer')}
              aria-label="Visit NPM package"
            >
              <Icon 
                name="brand_npm_24"
                size={24} 
              />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="tertiary"
              size="md"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Icon 
                name={theme === 'dark' ? 'moon_24' : 'sun_24'} 
                size={24} 
              />
            </Button>

            {/* Mobile Menu Button - Only show on mobile */}
            <Button
              variant="tertiary"
              size="sm"
              className="top-navigation__mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon 
                name={mobileMenuOpen ? 'shape_x_24' : 'text_align_left_24'} 
                size={24} 
              />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
} 