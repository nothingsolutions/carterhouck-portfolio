"use client";

import { useState, useEffect, useRef } from "react";

interface UseImageLoaderOptions {
  src: string;
  priority?: boolean; // If true, load immediately
  enabled?: boolean; // If false, don't load at all
}

interface UseImageLoaderReturn {
  isLoaded: boolean;
  shouldLoad: boolean;
  error: boolean;
  imgRef: React.RefObject<HTMLImageElement>;
}

/**
 * Custom hook for optimized image loading with Intersection Observer
 * Supports priority loading for above-the-fold images
 */
export function useImageLoader({
  src,
  priority = false,
  enabled = true,
}: UseImageLoaderOptions): UseImageLoaderReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || !enabled);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If priority or disabled, skip Intersection Observer
    if (priority || !enabled) {
      setShouldLoad(true);
      return;
    }

    // If already loaded, don't set up observer
    if (isLoaded) {
      return;
    }

    // Create Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // Disconnect once we've decided to load
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }
        });
      },
      {
        // Start loading when image is 200px away from viewport
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    observerRef.current = observer;

    // Observe the image element if it exists
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [priority, enabled, isLoaded]);

  // Handle image load
  useEffect(() => {
    if (!shouldLoad || !src) return;

    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src]);

  return {
    isLoaded,
    shouldLoad,
    error,
    imgRef,
  };
}

/**
 * Simplified hook that returns loading state and ref
 * Use this when you need the ref for Intersection Observer
 */
export function useImageLoaderWithRef(
  options: UseImageLoaderOptions
): UseImageLoaderReturn & { imgRef: React.RefObject<HTMLImageElement> } {
  const imgRef = useRef<HTMLImageElement>(null);
  const result = useImageLoader(options);
  return { ...result, imgRef };
}

