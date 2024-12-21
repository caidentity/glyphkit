import { GlyphKitIcon, GlyphKitConfig } from '../types';
export declare class SVGProcessor {
    private config;
    constructor(config?: GlyphKitConfig);
    processIcons(): Promise<GlyphKitIcon[]>;
    private determineCategory;
    private generateTags;
}
//# sourceMappingURL=svgProcessor.d.ts.map