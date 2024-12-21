export interface GlyphKitIcon {
    id: string;
    name: string;
    path: string;
    categories?: string[];
    tags?: string[];
}
export interface GlyphKitConfig {
    svgDirectory?: string;
    customCategories?: Record<string, string[]>;
    defaultCategory?: string;
    iconPrefix?: string;
}
//# sourceMappingURL=types.d.ts.map