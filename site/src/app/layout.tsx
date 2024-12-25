import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import TopNavigation from '@/components/TopNavigationBar/TopNavigation';
import Providers from '@/components/Providers';
import { siteMetadata, defaultOpenGraphImage } from '@/config/metadata';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  
  // OpenGraph
  openGraph: {
    type: 'website',
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    images: [
      {
        ...defaultOpenGraphImage,
        url: new URL(defaultOpenGraphImage.url, siteMetadata.siteUrl).toString()
      }
    ],
    siteName: siteMetadata.title,
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [defaultOpenGraphImage],
    creator: '@glyphkit',
  },
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
      <head>
        {/* Preload icon registry */}
        <link 
          rel="preload" 
          href="/lib/iconRegistry.json" 
          as="fetch" 
          crossOrigin="anonymous" 
        />
      </head>
      <body>
        <Providers>
          <TopNavigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
