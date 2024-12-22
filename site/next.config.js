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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

  // Configure webpack to handle SVG files from parent directory in production
  webpack: (config, { isServer, dev }) => {
    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Add static asset handling
    config.module.rules.push({
      test: /\.(png|jpg|gif|ico|webp|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'assets/[path][name][ext]',
      },
    });

    // Copy assets to public directory during build
    if (isServer && !dev) {
      const CopyPlugin = require('copy-webpack-plugin');
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.join(process.cwd(), 'src/assets'),
              to: path.join(process.cwd(), 'public/assets'),
              noErrorOnMissing: true,
              force: true,
            },
            {
              from: path.join(process.cwd(), '..', 'public', 'icons'),
              to: path.join(process.cwd(), 'public', 'icons'),
              noErrorOnMissing: true,
              force: true,
            },
          ],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
