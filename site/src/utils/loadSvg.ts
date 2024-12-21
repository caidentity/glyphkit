export async function loadSvgContent(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load SVG: ${path}`);
  }
  return response.text();
} 