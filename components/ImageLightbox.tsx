"use client";

import { useEffect, useCallback } from "react";
import type { Project } from "@/lib/projects";

const lightboxAspect: Record<string, string> = {
  vertical:   "w-[360px] h-[480px]",
  square:     "w-[440px] h-[440px]",
  horizontal: "w-[480px] h-[360px]",
};

interface ImageLightboxProps {
  projects: Project[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({
  projects,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const project = projects[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [handleKeyDown]);

  if (!project) return null;

  return (
    /* Backdrop — click to close */
    <div
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close × */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-2xl font-mono leading-none text-black hover:opacity-40 transition-opacity"
        aria-label="Close"
      >
        ×
      </button>

      {/* Prev ← */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono text-black hover:opacity-40 transition-opacity"
        aria-label="Previous"
      >
        ←
      </button>

      {/* Next → */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-mono text-black hover:opacity-40 transition-opacity"
        aria-label="Next"
      >
        →
      </button>

      {/* Sticky project info panel */}
      <aside
        className="absolute top-3 left-3 md:top-4 md:left-4 z-10 w-[min(92vw,360px)] border border-black bg-white p-2 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-medium leading-tight mb-1.5">Carter Houck</p>
        <p className="text-[11px] leading-tight">{project.title}</p>
        <p className="text-[11px] leading-tight text-gray-600">{project.client}</p>
        <p className="text-[10px] leading-tight text-gray-500 mt-1">{project.code}</p>

        {(project.description || project.links?.length) ? (
          <div className="mt-2 pt-2 border-t border-black/20 space-y-2">
            {project.description ? (
              <p className="text-[10px] leading-snug text-gray-700">{project.description}</p>
            ) : null}

            {project.links?.length ? (
              <div className="space-y-1">
                <p className="text-[10px] font-medium leading-tight">Links</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {project.links.map((link) => (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] underline underline-offset-2 hover:opacity-60 transition-opacity"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>

      {/* Image — stop propagation so clicks on image don't close */}
      <div
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center pt-28 md:pt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {project.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageSrc}
            alt={project.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        ) : (
          <LightboxPlaceholder orientation={project.orientation} />
        )}
      </div>
    </div>
  );
}

function LightboxPlaceholder({ orientation }: { orientation: string }) {
  return (
    <div
      className={`${lightboxAspect[orientation] ?? "w-[440px] h-[440px]"} max-w-[90vw] max-h-[80vh] bg-gray-100 relative`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#cccccc" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
