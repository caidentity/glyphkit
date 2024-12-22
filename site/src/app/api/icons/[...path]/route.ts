import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const sanitizedPath = params.path
      .map(segment => segment.replace(/[^a-zA-Z0-9-_\.]/g, ''))
      .join('/');

    const iconPath = path.join(
      process.cwd(),
      'packages/glyphkit/icons/flat/Icons',
      `${sanitizedPath}.svg`
    );

    const svgContent = await fs.readFile(iconPath, 'utf-8');
    
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error loading icon:', error);
    return new NextResponse('Icon not found', { status: 404 });
  }
}