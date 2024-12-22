import * as React from 'react';
import { brandIcons } from './Icons/brand.js';

interface IconData {
  d: string;
  viewBox: string;
}

// Helper function to extract path data from SVG string
function extractPathData(svgString: string): IconData {
  const pathMatch = svgString.match(/d="([^"]+)"/);
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);

  if (!pathMatch?.[1]) {
    console.error('Invalid SVG content:', svgString);
    throw new Error('No valid path data found in SVG');
  }

  return {
    d: pathMatch[1].trim(),
    viewBox: viewBoxMatch?.[1] || "0 0 24 24"
  };
}

// Convert icon maps to the correct format
function convertIconMap(icons: Record<string, string>): Record<string, IconData> {
  const converted: Record<string, IconData> = {};
  
  for (const [key, value] of Object.entries(icons)) {
    try {
      console.log(`Converting icon: ${key}`);
      converted[key] = extractPathData(value);
      console.log('Converted data:', converted[key]);
    } catch (error) {
      console.error(`Failed to convert icon "${key}":`, error);
    }
  }
  
  return converted;
}

// Only process brandIcons for now
const convertedIcons = convertIconMap(brandIcons);

export const paths = {
  ...convertedIcons,
  default: { d: '', viewBox: '0 0 24 24' }
};

export type PathName = keyof typeof paths;
