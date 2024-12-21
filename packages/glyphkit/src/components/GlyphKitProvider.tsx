import { createContext, useContext, useEffect, useState } from 'react';
import { GlyphKitIcon, GlyphKitConfig } from '../types';
import { SVGProcessor } from '../utils/svgProcessor';

interface GlyphKitContextType {
  icons: GlyphKitIcon[];
  isLoading: boolean;
  error: Error | null;
}

const GlyphKitContext = createContext<GlyphKitContextType>({
  icons: [],
  isLoading: true,
  error: null,
});

export const useGlyphKit = () => useContext(GlyphKitContext);

interface GlyphKitProviderProps {
  config?: GlyphKitConfig;
  children: React.ReactNode;
}

export const GlyphKitProvider: React.FC<GlyphKitProviderProps> = ({
  config,
  children,
}) => {
  const [state, setState] = useState<GlyphKitContextType>({
    icons: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const processor = new SVGProcessor(config);
        const icons = await processor.processIcons();
        setState({ icons, isLoading: false, error: null });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    };

    loadIcons();
  }, [config]);

  return (
    <GlyphKitContext.Provider value={state}>
      {children}
    </GlyphKitContext.Provider>
  );
}; 