import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'icon-metadata.json');
    const metadata = await fs.readFile(metadataPath, 'utf-8');
    return NextResponse.json(JSON.parse(metadata));
  } catch (error) {
    console.error('Error loading icons:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to load icons' },
      { status: 500 }
    );
  }
} 