"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  sizes?: string;
  onError?: (error: Event) => void;
}

interface ImageState {
  isLoading: boolean;
  imgSrc: string;
  blurDataUrl: string;
  error: string | null;
  isClient: boolean;
}

const TINY_BLUR_SIZE = 10;
const DEFAULT_QUALITY = 75;

const generateTinyPlaceholder = (width: number = 16, height: number = 16): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
    </svg>
  `)}`;
};

const ImageComponent = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = DEFAULT_QUALITY,
  priority = false,
  objectFit = 'cover',
  placeholder = 'blur',
  sizes = '100vw',
}: ImageProps) => {
  const isSvg = src.toLowerCase().endsWith('.svg');
  
  const [state, setState] = useState<ImageState>({
    isLoading: !priority && !isSvg,
    imgSrc: src,
    blurDataUrl: isSvg ? '' : generateTinyPlaceholder(width, height),
    error: null,
    isClient: false
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);

  // Add debugging logs
  useEffect(() => {
    console.log('Image Component Debug:', {
      src,
      currentSrc: state.imgSrc,
      isLoading: state.isLoading,
      isClient: state.isClient,
      width,
      height
    });
  }, [src, state.imgSrc, state.isLoading, state.isClient, width, height]);

  // Handle client-side initialization
  useEffect(() => {
    setState(prev => ({ ...prev, isClient: true }));
  }, []);

  // URL optimization only runs on client after hydration
  const getOptimizedImageUrl = useCallback((url: string): string => {
    if (!state.isClient || isSvg) return url;

    try {
      if (url.includes('imagecdn') || url.includes('cloudinary')) {
        return url;
      }

      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width?.toString() || 'auto');
      urlObj.searchParams.set('q', quality.toString());
      return urlObj.toString();
    } catch {
      return url;
    }
  }, [width, quality, state.isClient, isSvg]);

  // Handle image preloading - Fixed version
  useEffect(() => {
    if (!state.isClient || !priority) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(src);

    // Check if link already exists
    const existingLink = document.head.querySelector(`link[href="${link.href}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
      
      return () => {
        try {
          // Only try to remove if the link is still in document.head
          if (link.parentNode === document.head) {
            document.head.removeChild(link);
          }
        } catch (error) {
          console.warn('Failed to remove preload link:', error);
        }
      };
    }
  }, [src, priority, getOptimizedImageUrl, state.isClient]);

  // Load blur placeholder
  const loadBlurPlaceholder = useCallback(async () => {
    if (!state.isClient || !src || placeholder !== 'blur' || isSvg) return;

    try {
      const imgElement = new window.Image();
      imgElement.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
        imgElement.src = src;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = TINY_BLUR_SIZE;
      canvas.height = TINY_BLUR_SIZE;
      ctx.drawImage(imgElement, 0, 0, TINY_BLUR_SIZE, TINY_BLUR_SIZE);

      const blurDataUrl = canvas.toDataURL('image/jpeg', 0.1);
      setState(prev => ({ ...prev, blurDataUrl }));
    } catch {
      // Keep the SVG placeholder on error
    }
  }, [src, placeholder, state.isClient, isSvg]);

  // Intersection Observer setup
  useEffect(() => {
    if (!state.isClient || priority || typeof IntersectionObserver === 'undefined') return;

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadBlurPlaceholder();
            intersectionObserver.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      intersectionObserver.current.observe(imageRef.current);
    }

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [priority, loadBlurPlaceholder, state.isClient]);

  const handleLoad = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false }));
    setTimeout(() => {
      setState(prev => ({ ...prev, blurDataUrl: '' }));
    }, 300);
  }, []);

  // Add error handling
  const handleError = useCallback(() => {
    console.error(`Failed to load image: ${src}`);
    setState(prev => ({ 
      ...prev, 
      isLoading: false,
      error: `Failed to load image: ${src}`
    }));
  }, [src]);

  // Helper function to handle dimension values
  const getDimensionValue = (value: number | `${number}%` | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.endsWith('%')) return undefined;
    return undefined;
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'string' ? width : width ? `${width}px` : 'auto',
    height: typeof height === 'string' ? height : height ? `${height}px` : 'auto',
    aspectRatio: (typeof width === 'number' && typeof height === 'number') ? `${width}/${height}` : 'auto'
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <AnimatePresence>
        {(state.isLoading && state.blurDataUrl && !isSvg) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${state.blurDataUrl})`,
              backgroundSize: objectFit,
              backgroundPosition: 'center',
              filter: 'blur(20px)',
              transform: 'scale(1.2)'
            }}
          />
        )}
      </AnimatePresence>

      <motion.img
        ref={imageRef}
        src={state.isClient ? getOptimizedImageUrl(src) : src}
        alt={alt}
        width={getDimensionValue(width)}
        height={getDimensionValue(height)}
        sizes={sizes}
        className="w-full h-full"
        style={{ 
          objectFit: isSvg ? 'contain' : objectFit,
          width: typeof width === 'string' ? width : undefined,
          height: typeof height === 'string' ? height : undefined
        }}
        initial={{ opacity: isSvg ? 1 : 0 }}
        animate={{ opacity: isSvg ? 1 : (state.isLoading ? 0 : 1) }}
        transition={{ duration: 0.3 }}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};

// Memoize the component
const Image = memo(ImageComponent);

export default Image;