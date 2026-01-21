"use client";

import { useState } from "react";
import { extractVideoUrl } from "./ImageGallery";

interface MasonryGridProps {
  images: string[];
  videoUrl?: string | null;
  projectName?: string;
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

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

export default function MasonryGrid({ images, videoUrl, projectName }: MasonryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasVideo = !!videoUrl;
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const totalMedia = (hasVideo ? 1 : 0) + images.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % totalMedia);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  };

  if (totalMedia === 0) {
    return (
      <div className="text-center py-12 text-[#666]">
        <p>No media available for this project.</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 px-4 md:px-8">
        {/* Video (if exists) */}
        {hasVideo && videoId && (
          <div
            className="break-inside-avoid mb-4 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={`${projectName} - Video`}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {images.map((image, index) => {
          const mediaIndex = hasVideo ? index + 1 : index;
          return (
            <div
              key={index}
              className="break-inside-avoid mb-4 cursor-pointer group"
              onClick={() => openLightbox(mediaIndex)}
            >
              <img
                src={image}
                alt={`${projectName} - ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-2xl transition-shadow group-hover:scale-[1.02] transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-30"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 font-mono text-sm z-30">
            {lightboxIndex + 1} / {totalMedia}
          </div>

          {/* Content */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxIndex === 0 && hasVideo && videoId ? (
              <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={projectName || "Video"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={images[hasVideo ? lightboxIndex - 1 : lightboxIndex]}
                alt={`${projectName} - ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Navigation */}
          {totalMedia > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-20 hover:bg-white/10 rounded-full"
                aria-label="Previous"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-20 hover:bg-white/10 rounded-full"
                aria-label="Next"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

