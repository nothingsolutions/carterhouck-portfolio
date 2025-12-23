"use client";

import { useState, useRef, useEffect } from "react";
import { Project } from "@/types/project";
import ProjectRow from "./ProjectRow";
import ImageGallery, { extractVideoUrl } from "./ImageGallery";

interface SpreadsheetTableProps {
  projects: Project[];
  isUnlocked: boolean;
  onUnlockRequest: () => void;
}

// Column widths in pixels for consistency between header and body
const COLUMNS = [
  { key: "image", label: "Image", width: 140 },
  { key: "item", label: "Project", width: 180 },
  { key: "client", label: "Client", width: 140 },
  { key: "category", label: "Category", width: 140 },
  { key: "role", label: "Role", width: 180 },
  { key: "date", label: "Date", width: 90 },
  { key: "notes", label: "Notes", width: 0 }, // 0 = flex/auto
];

export default function SpreadsheetTable({ projects, isUnlocked, onUnlockRequest }: SpreadsheetTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scroll between header and body
  useEffect(() => {
    const headerEl = headerScrollRef.current;
    const bodyEl = bodyScrollRef.current;
    
    if (!headerEl || !bodyEl) return;

    const syncBodyToHeader = () => {
      if (headerEl && bodyEl) {
        headerEl.scrollLeft = bodyEl.scrollLeft;
      }
    };

    bodyEl.addEventListener("scroll", syncBodyToHeader, { passive: true });
    
    return () => {
      bodyEl.removeEventListener("scroll", syncBodyToHeader);
    };
  }, []);

  const handleImageClick = (project: Project) => {
    const hasVideo = extractVideoUrl(project.notes) !== null;
    const hasImages = project.images.length > 0;
    
    if (hasImages || hasVideo) {
      setSelectedProject(project);
      setIsGalleryOpen(true);
    }
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      {/* Sticky Header - scrolls horizontally in sync with body */}
      <div className="sticky top-[142px] z-10 bg-[#2d2d2d] border-b-2 border-[#4a9eff]">
        <div 
          ref={headerScrollRef}
          className="w-full overflow-x-hidden"
        >
          <table className="w-full min-w-[1100px] border-collapse font-sans text-sm table-fixed">
            <colgroup>
              {COLUMNS.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-left text-[#e0e0e0] font-semibold uppercase text-xs tracking-wider border-r border-[#3a3a3a] last:border-r-0"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div 
        ref={bodyScrollRef}
        className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#4a4a4a] scrollbar-track-[#1a1a1a]"
      >
        <table className="w-full min-w-[1100px] border-collapse font-sans text-sm table-fixed">
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead className="sr-only">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                onImageClick={() => handleImageClick(project)}
                isEven={index % 2 === 0}
                isUnlocked={isUnlocked}
                onUnlockRequest={onUnlockRequest}
                priority={index < 8} // Priority load first 8 projects (above the fold)
              />
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="flex items-center justify-center h-64 text-[#666]">
            No projects found. Add some data to get started.
          </div>
        )}
      </div>

      {/* Row count footer */}
      <div className="mt-2 px-3 py-2 text-xs text-[#666] font-mono border-t border-[#3a3a3a]">
        {projects.length} project{projects.length !== 1 ? "s" : ""} total
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={selectedProject?.images || []}
        videoUrl={selectedProject ? extractVideoUrl(selectedProject.notes) : null}
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        projectName={selectedProject?.item}
      />
    </>
  );
}
