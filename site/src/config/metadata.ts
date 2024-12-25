const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const description = 'Modern icon toolkit for modern applications.'

export const siteMetadata = {
  title: 'Glyphkit',
  description,
  siteUrl: baseUrl,
} as const

// Add cache control headers and consistent description
export const defaultOpenGraphImage = {
  url: `${baseUrl}/assets/social/og-image.png?v=${process.env.NODE_ENV === 'production' ? Date.now() : 'dev'}`,
  width: 1200,
  height: 630,
  alt: `Glyphkit - ${description}`
}

// Add cache headers for social media crawlers
export const metadataHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
} 