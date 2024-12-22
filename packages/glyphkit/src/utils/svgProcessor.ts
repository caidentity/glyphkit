export function processSvgContent(svgContent: string): { path: string; viewBox?: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  
  if (!svg) {
    throw new Error('Invalid SVG content');
  }

  // Get the viewBox
  const viewBox = svg.getAttribute('viewBox');

  // Find all path elements and combine their data
  const paths = svg.querySelectorAll('path');
  const pathData = Array.from(paths)
    .map(path => path.getAttribute('d'))
    .filter(Boolean)
    .join(' ');

  if (!pathData) {
    throw new Error('No valid path data found in SVG');
  }

  return {
    path: pathData,
    viewBox: viewBox || undefined
  };
}