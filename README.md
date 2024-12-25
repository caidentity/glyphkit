# GlyphKit

Glyphkit is a repository of icon libraries designed for building cohesison and high quality applications. 


## Technologies

- Next.js 13+
- React 18
- TypeScript
- TanStack Query


## Scripts

- `dev`: Start development server
- `build`: Create production build
- `start`: Start production server
- `generate-icons`: Generate icon metadata
- `lint`: Run ESLint
- `type-check`: Run TypeScript compiler check



## Setup

1. Generate icon metadata:
npm run generate-icons

This script scans the `public/icons` directory and generates metadata for all SVG icons.

## Development

Run the development server:



# Scripts
## Package Glyphkit 
### 1. First run convert-paths to normalize all icon files
npm run convert-paths

### 2. Then run generate-icons to update the package
npm run generate:icons

Once both run... publish so the site can fetch

## GlyphKit.com Site 
For the site to proropery render and read all sites... run npm run build to gather all names and catagories in the package.
make sure getting latest build of the package...