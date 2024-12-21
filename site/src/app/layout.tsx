import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import TopNavigation from '@/components/TopNavigationBar/TopNavigation';
import Providers from '@/components/Providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Glyphkit',
  description: 'Created with Next.js and TypeScript',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <TopNavigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
