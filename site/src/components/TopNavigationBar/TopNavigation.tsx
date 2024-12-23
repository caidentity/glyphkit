'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './TopNavigation.scss';
import { Icon } from '@glyphkit/glyphkit';
import Image from 'next/image';
import { getLogoPath } from '@/lib/assetLoader'

const navigation = [
  { name: 'Icons', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'NPM', href: 'https://www.npmjs.com/package/@glyphkit/glyphkit' },
];

export default function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="top-navigation">
      <nav className="top-navigation__container" aria-label="Top">
        <div className="top-navigation__content">
          <div className="top-navigation__mobile-menu">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          <Link href="/" className="top-navigation__logo">
            <Image 
              src={logoPath}
              alt="Glyph Kit Logo"
              width={120}
              height={32}
              priority
            />
          </Link>

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
            
            <button
              onClick={toggleTheme}
              className="top-navigation__theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Icon
                  name="moon_16"
                  size={20}
                  color="currentColor"
                  onError={(error) => {
                    console.error('Icon error:', error);
                  }}
                />
              ) : (
                <Icon
                  name="sun_16"
                  size={20}
                  color="currentColor"
                  onError={(error) => {
                    console.error('Icon error:', error);
                  }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="py-2 mt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 px-3 rounded-md ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
} 