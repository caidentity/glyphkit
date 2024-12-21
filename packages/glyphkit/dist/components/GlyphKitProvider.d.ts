/// <reference types="react" />
import { GlyphKitIcon, GlyphKitConfig } from '../types';
interface GlyphKitContextType {
    icons: GlyphKitIcon[];
    isLoading: boolean;
    error: Error | null;
}
export declare const useGlyphKit: () => GlyphKitContextType;
interface GlyphKitProviderProps {
    config?: GlyphKitConfig;
    children: React.ReactNode;
}
export declare const GlyphKitProvider: React.FC<GlyphKitProviderProps>;
export {};
//# sourceMappingURL=GlyphKitProvider.d.ts.map