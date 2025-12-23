"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface MediaItem {
  type: "video" | "image";
  url: string;
  thumbnailUrl?: string;
}

interface ImageGalleryProps {
  images: string[];
  videoUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Match various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Extract video URL from notes field
export function extractVideoUrl(notes: string): string | null {
  if (!notes) return null;

  // Look for YouTube URLs
  const youtubeMatch = notes.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+[^\s]*/);
  if (youtubeMatch) return youtubeMatch[0];

  return null;
}

export default function ImageGallery({
  images,
  videoUrl,
  isOpen,
  onClose,
  projectName,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize media items
  const mediaItems = useMemo(() => {
    const items: MediaItem[] = [];

    if (videoUrl) {
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        items.push({
          type: "video",
          url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        });
      }
    }

    images.forEach((img) => {
      items.push({
        type: "image",
        url: img,
      });
    });

    return items;
  }, [images, videoUrl]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    setImageLoaded(false);
  }, [mediaItems.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  }, [mediaItems.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  // Reset state when gallery opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setImageLoaded(false);
      document.body.style.overflow = "hidden"; // Prevent scroll
    }
  }, [isOpen]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Simple preloading of next image
  useEffect(() => {
    if (!isOpen || mediaItems.length === 0) return;

    const nextIndex = (currentIndex + 1) % mediaItems.length;
    const nextItem = mediaItems[nextIndex];
    if (nextItem?.type === "image") {
      const img = new Image();
      img.src = nextItem.url;
    }
  }, [isOpen, currentIndex, mediaItems]);

  if (!isOpen || mediaItems.length === 0) return null;

  const currentMedia = mediaItems[currentIndex];
  if (!currentMedia) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="text-white/80 font-mono text-sm">
          {projectName}
        </div>

        <div className="text-white/60 font-mono text-sm">
          {currentIndex + 1} / {mediaItems.length}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {currentMedia.type === "video" ? (
          <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl">
            <iframe
              src={currentMedia.url}
              title={projectName || "Video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <img
              key={currentMedia.url} // Force re-render on url change for clean transitions
              src={currentMedia.url}
              alt={`${projectName} - ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              loading="eager"
              decoding="sync"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-20 hover:bg-white/10 rounded-full hidden md:block"
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-20 hover:bg-white/10 rounded-full hidden md:block"
            aria-label="Next"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile Tap Areas (Invisible) */}
          <div className="absolute inset-y-0 left-0 w-1/4 z-10 md:hidden" onClick={(e) => { e.stopPropagation(); handlePrevious(); }} />
          <div className="absolute inset-y-0 right-0 w-1/4 z-10 md:hidden" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
        </>
      )}

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-20 overflow-x-auto">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                setImageLoaded(false);
              }}
              className={`relative h-12 w-16 flex-shrink-0 rounded-sm overflow-hidden border transition-all ${idx === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
            >
              <img
                src={item.type === 'video' ? item.thumbnailUrl : item.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
