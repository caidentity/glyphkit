# Icon Viewer

A web application for viewing and managing SVG icons, built with Next.js, React, and TypeScript.

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Installation

1. Clone the repository:



## Features

- View SVG icons in different sizes
- Grid view of all available icons
- Icon metadata generation
- Real-time SVG rendering
- Size customization

## Technologies

- Next.js 13+
- React 18
- TypeScript
- TanStack Query
- Tailwind CSS

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
##Package Glyphkit generatiion
# 1. First run convert-paths to normalize all icon files
npm run convert-paths

# 2. Then run generate-icons to update the package
npm run generate:icons

Once both run... publish so the site can fetch

## Site updates
For the site to proropery render and read all sites... run npm run build to gather all names and catagories in the package.
make sure getting latest build of the package...