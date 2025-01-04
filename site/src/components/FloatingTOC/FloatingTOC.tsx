'use client';

import { useEffect } from 'react';
import './FloatingTOC.scss';

interface TOCItem {
  href: string;
  text: string;
}

interface FloatingTOCProps {
  items: TOCItem[];
}

export default function FloatingTOC({ items }: FloatingTOCProps) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.floating-toc a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.5 });

    const handleScroll = () => {
      const toc = document.querySelector('.floating-toc');
      if (!toc) return;

      const startPosition = window.innerHeight * 0.4 + 32;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= startPosition) {
        toc.classList.add('sticky');
      } else {
        toc.classList.remove('sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="floating-toc">
      <h2>On This Page</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 