export const siteMetadata = {
  title: 'Glyphkit',
  description: 'Modern icon toolkit for your next web project',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

export const defaultOpenGraphImage = {
  url: '/assets/social/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Glyphkit - Modern icon toolkit'
} 