import * as React from 'react';

// Import individual icon files with .js extensions
import { arrowIcons } from './Icons/arrows.js';
import { brandIcons } from './Icons/brand.js';
import { communicationIcons } from './Icons/communication.js';
import { controlIcons } from './Icons/controls.js';
import { dataIcons } from './Icons/data.js';
import { fileIcons } from './Icons/files.js';
import { locationIcons } from './Icons/location.js';
import { mediaIcons } from './Icons/media.js';
import { messageIcons } from './Icons/message.js';
import { moneyIcons } from './Icons/money.js';
import { natureIcons } from './Icons/nature.js';
import { objectIcons } from './Icons/objects.js';
import { peopleIcons } from './Icons/people.js';
import { shapeIcons } from './Icons/shapes.js';
import { systemIcons } from './Icons/system.js';
import { textIcons } from './Icons/text.js';
import { timeIcons } from './Icons/time.js';
import { uiIcons } from './Icons/ui.js';
import { viewIcons } from './Icons/view.js';

// Define types for our icon system
interface IconPathData {
  path: string;
  viewBox?: string;
}

interface IconProps extends React.SVGProps<SVGPathElement> {
  d: string;
  viewBox?: string;
}

type IconElement = React.ReactElement<IconProps>;

// Helper function to extract path data from SVG string
function extractPathData(svgString: string): IconPathData {
  const pathMatch = svgString.match(/<path[^>]*d="([^"]*)"[^>]*>/);
  const viewBoxMatch = svgString.match(/viewBox="([^"]*)"/);

  if (!pathMatch?.[1]) {
    throw new Error('No valid path data found in SVG');
  }

  return {
    path: pathMatch[1],
    viewBox: viewBoxMatch?.[1] || "0 0 24 24"
  };
}

// Convert icon maps to the correct format
const convertIconMap = (icons: Record<string, string>): Record<string, IconElement> => {
  const converted: Record<string, IconElement> = {};
  
  for (const [key, value] of Object.entries(icons)) {
    try {
      const { path, viewBox } = extractPathData(value);
      converted[key] = (
        <path 
          d={path}
          viewBox={viewBox}
        />
      );
    } catch (error) {
      console.error(`Failed to convert icon: ${key}`, error);
    }
  }
  
  return converted;
};

// Convert all icon sets
const convertedIcons = {
  ...convertIconMap(arrowIcons),
  ...convertIconMap(brandIcons),
  ...convertIconMap(communicationIcons),
  ...convertIconMap(controlIcons),
  ...convertIconMap(dataIcons),
  ...convertIconMap(fileIcons),
  ...convertIconMap(locationIcons),
  ...convertIconMap(mediaIcons),
  ...convertIconMap(messageIcons),
  ...convertIconMap(moneyIcons),
  ...convertIconMap(natureIcons),
  ...convertIconMap(objectIcons),
  ...convertIconMap(peopleIcons),
  ...convertIconMap(shapeIcons),
  ...convertIconMap(systemIcons),
  ...convertIconMap(textIcons),
  ...convertIconMap(timeIcons),
  ...convertIconMap(uiIcons),
  ...convertIconMap(viewIcons),
} as const;

export const paths = {
  ...convertedIcons,
  default: <path /> as IconElement
} as const;

export type PathName = keyof typeof paths;
