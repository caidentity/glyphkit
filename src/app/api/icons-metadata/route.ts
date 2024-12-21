import { NextResponse } from 'next/server';
import { IconCategory } from '@/types/icon';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // This is just an example - adjust the path according to your icon storage structure
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    const categories = await fs.readdir(iconsDir);

    const iconCategories: IconCategory[] = await Promise.all(
      categories.map(async (categoryName) => {
        const categoryPath = path.join(iconsDir, categoryName);
        const files = await fs.readdir(categoryPath);

        const icons = files
          .filter(file => file.endsWith('.svg'))
          .map(file => ({
            name: path.basename(file, '.svg'),
            path: `/icons/${categoryName}/${file}`,
            size: file.includes('16') ? 16 : 24,
            category: categoryName,
            tags: [], // You might want to add a way to define tags
          }));

        return {
          name: categoryName,
          icons,
        };
      })
    );

    return NextResponse.json(iconCategories);
  } catch (error) {
    console.error('Error loading icons:', error);
    return NextResponse.json(
      { error: 'Failed to load icons' },
      { status: 500 }
    );
  }
} 