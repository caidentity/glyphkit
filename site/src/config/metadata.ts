const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const siteMetadata = {
  title: 'Glyphkit',
  description: 'Modern icon toolkit for modern applications.',
  siteUrl: baseUrl,
} as const

// Fix case sensitivity in filename
const ogImagePath = '/assets/social/og-image.png' // Changed from og-Image.png
export const defaultOpenGraphImage = {
  url: `${baseUrl}${ogImagePath}?v=${process.env.NODE_ENV === 'production' ? Date.now() : 'dev'}`,
  width: 1200,
  height: 630,
  alt: 'Glyphkit - Modern icon toolkit'
} 