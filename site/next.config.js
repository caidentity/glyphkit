const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // Static file serving
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com",
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Build optimization
  swcMinify: true,
  
  // Environment configuration
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Configure rewrites to handle icon requests
  async rewrites() {
    return [
      {
        source: '/registry/:path*',
        destination: '/registry/:path*'
      },
      {
        source: '/icons/:path*',
        destination: '/icons/:path*'
      },
    ];
  },

  // Simplify webpack config
  webpack: (config, { isServer, dev }) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Copy assets in both dev and prod
    const CopyPlugin = require('copy-webpack-plugin');
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets/root',
            to: '.',
            noErrorOnMissing: true,
          },
          {
            from: 'src/assets/social',
            to: 'assets/social',
            noErrorOnMissing: true,
          },
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
