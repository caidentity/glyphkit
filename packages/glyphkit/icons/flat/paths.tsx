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
type IconPathData = {
  path: string;
  viewBox?: string;
};

type IconElement = React.ReactElement<React.SVGProps<SVGPathElement>>;
type IconMap = Record<string, IconPathData>;

// Convert string paths to React elements
const convertPathToElement = (pathData: IconPathData): IconElement => (
  <path 
    d={pathData.path} 
    fill="currentColor"
  />
);

// Convert icon maps to the correct format
const convertIconMap = (icons: Record<string, string | IconPathData>): Record<string, IconElement> => {
  const converted: Record<string, IconElement> = {};
  
  for (const [key, value] of Object.entries(icons)) {
    if (typeof value === 'string') {
      converted[key] = convertPathToElement({ path: value });
    } else {
      converted[key] = convertPathToElement(value);
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
};

export const paths: Record<string, IconElement> & { default: IconElement } = {
  ...convertedIcons,
  default: <path /> as IconElement
};

export const getPath = (name: PathName): IconElement => {
  return paths[name] ?? paths.default;
};

export type PathName = keyof typeof paths;
