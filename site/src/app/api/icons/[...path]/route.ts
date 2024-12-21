import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BATCH_SIZE = 10; // Number of SVGs to load in parallel

async function loadSvgBatch(paths: string[]): Promise<{ [key: string]: string }> {
  const results: { [key: string]: string } = {};
  
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        results[filePath] = content;
      } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
      }
    })
  );
  
  return results;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    console.log('Requested path:', params.path);
    const sanitizedPath = params.path
      .map(segment => segment.replace(/[^a-zA-Z0-9-_\.]/g, ''))
      .join('/');

    const iconPath = path.join(
      process.cwd(),
      '..',
      'public',
      'icons',
      sanitizedPath
    );

    // Check if this is a batch request
    const searchParams = new URL(request.url).searchParams;
    const batch = searchParams.get('batch') === 'true';
    
    if (batch) {
      const batchPaths = JSON.parse(searchParams.get('paths') || '[]');
      const svgContents = await loadSvgBatch(
        batchPaths.map((p: string) => path.join(process.cwd(), '..', 'public', 'icons', p))
      );
      
      return NextResponse.json(svgContents, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const svgContent = await fs.readFile(iconPath, 'utf-8');
    
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error loading icon:', {
      error,
      params: params.path,
      requestUrl: request.url
    });
    return new NextResponse('Icon not found', { status: 404 });
  }
} 