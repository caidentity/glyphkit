import * as fs from 'fs';
import * as path from 'path';
import { GlyphKitIcon, GlyphKitConfig } from '../types';

export class SVGProcessor {
  private config: Required<GlyphKitConfig>;

  constructor(config: GlyphKitConfig = {}) {
    this.config = {
      svgDirectory: config.svgDirectory || 'public/icons',
      customCategories: config.customCategories || {},
      defaultCategory: config.defaultCategory || 'misc',
      iconPrefix: config.iconPrefix || 'gk',
    };
  }

  async processIcons(): Promise<GlyphKitIcon[]> {
    const icons: GlyphKitIcon[] = [];
    const files = await fs.promises.readdir(this.config.svgDirectory);

    for (const file of files) {
      if (path.extname(file) === '.svg') {
        const name = path.basename(file, '.svg');
        const category = this.determineCategory(name);
        
        icons.push({
          id: `${this.config.iconPrefix}-${name}`,
          name,
          path: path.join(this.config.svgDirectory, file),
          categories: [category],
          tags: this.generateTags(name),
        });
      }
    }

    return icons;
  }

  private determineCategory(name: string): string {
    for (const [category, patterns] of Object.entries(this.config.customCategories)) {
      if (patterns.some(pattern => name.includes(pattern))) {
        return category;
      }
    }
    return this.config.defaultCategory;
  }

  private generateTags(name: string): string[] {
    return name.split('-').filter(Boolean);
  }
} 