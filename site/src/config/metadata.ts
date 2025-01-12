const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const description = 'Modern icon toolkit for modern applications.'

// More aggressive cache-busting using timestamp and random hash
const cacheBuster = process.env.NODE_ENV === 'production' 
  ? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  : 'dev'

export const siteMetadata = {
  title: 'Glyphkit',
  description,
  siteUrl: baseUrl,
} as const

// More aggressive cache control headers
export const defaultOpenGraphImage = {
  url: `${baseUrl}/assets/social/og-image.png?v=${cacheBuster}`,
  width: 1200,
  height: 630,
  alt: `Glyphkit - ${description}`
}

// More aggressive cache control headers
export const metadataHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '-1',
  'Surrogate-Control': 'no-store',
  'Vary': '*',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com",
} 