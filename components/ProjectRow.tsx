"use client";

import { Project } from "@/types/project";
import { extractVideoUrl } from "./ImageGallery";

interface ProjectRowProps {
  project: Project;
  onImageClick: () => void;
  isEven: boolean;
  isUnlocked: boolean;
  onUnlockRequest: () => void;
}

// Lorem ipsum placeholder texts of varying lengths
const LOREM = {
  short: "Lorem ipsum",
  medium: "Lorem ipsum dolor sit",
  long: "Lorem ipsum dolor sit amet consectetur",
  notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  date: "00.0000",
};

// Extract YouTube video ID for thumbnail
function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  return null;
}

// Convert URLs in text to clickable links
function linkifyText(text: string): React.ReactNode {
  if (!text) return "—";

  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (part.match(urlPattern)) {
      // Clean up trailing punctuation that might have been captured
      const cleanUrl = part.replace(/[,.\s]+$/, '');
      return (
        <a
          key={index}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#4a9eff] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {cleanUrl}
        </a>
      );
    }
    return part;
  });
}

export default function ProjectRow({
  project,
  onImageClick,
  isEven,
  isUnlocked,
  onUnlockRequest,
}: ProjectRowProps) {
  const hasImages = project.images.length > 0;
  const imageCount = project.images.length;
  const videoUrl = extractVideoUrl(project.notes);
  const hasVideo = videoUrl !== null;
  const hasMedia = hasImages || hasVideo;
  const videoThumbnail = videoUrl ? getYouTubeThumbnail(videoUrl) : null;
  const isLoginRequired = project.status.toLowerCase() === "login required";
  const isProtected = isLoginRequired && !isUnlocked;

  // Google Analytics Event Tracking
  const trackEvent = (eventName: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        project_name: project.item,
        client: project.client,
        category: project.category,
      });
    }
  };

  const handleUnlockRequest = () => {
    trackEvent('request_project_access');
    onUnlockRequest();
  };

  const handleImageClick = () => {
    trackEvent('view_project_media');
    onImageClick();
  };

  // Total media count (video counts as 1 + images)
  const totalMediaCount = (hasVideo ? 1 : 0) + imageCount;

  // Blurred cell wrapper for protected rows
  const BlurredContent = ({ children }: { children: React.ReactNode }) => (
    <span className="blur-[6px] select-none pointer-events-none">{children}</span>
  );

  return (
    <tr
      className={`border-b border-[#3a3a3a] hover:bg-[#2a2a2a] transition-colors ${isEven ? "bg-[#1e1e1e]" : "bg-[#252525]"
        } ${isProtected ? "opacity-60" : ""}`}
    >
      {/* Image cell */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] align-middle">
        {isProtected ? (
          <button
            onClick={handleUnlockRequest}
            className="w-28 h-[150px] rounded bg-[#2a2a2a] border border-[#3a3a3a] flex flex-col items-center justify-center gap-1 hover:border-[#4a9eff] hover:bg-[#2a2a2a]/80 transition-colors cursor-pointer group"
          >
            <svg
              className="w-5 h-5 text-[#666] group-hover:text-[#4a9eff] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[10px] text-[#666] group-hover:text-[#4a9eff] transition-colors">
              Request Access
            </span>
          </button>
        ) : hasMedia ? (
          <button
            onClick={handleImageClick}
            className="relative group cursor-pointer"
            aria-label={`View ${totalMediaCount} item${totalMediaCount > 1 ? "s" : ""}`}
          >
            <div className="w-28 h-[150px] rounded overflow-hidden border border-[#3a3a3a] group-hover:border-[#5a5a5a] transition-colors relative">
              {/* Show video thumbnail if video exists and no images, otherwise show first image */}
              {hasVideo && !hasImages && videoThumbnail ? (
                <>
                  <img
                    src={videoThumbnail}
                    alt={`Carter Houck - ${project.item} - ${project.client} (Video Thumbnail)`}
                    title={`Carter Houck - ${project.item} - ${project.client}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : hasImages ? (
                <img
                  src={project.images[0]}
                  alt={`Carter Houck - ${project.item} - ${project.client}`}
                  title={`Carter Houck - ${project.item} - ${project.client}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : null}
            </div>
            {/* Media count badge */}
            {totalMediaCount > 1 && (
              <span className="absolute -top-1 -right-1 bg-[#4a9eff] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalMediaCount}
              </span>
            )}
            {/* Video indicator when there are images + video */}
            {hasVideo && hasImages && (
              <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </button>
        ) : (
          <div className="w-28 h-[150px] rounded bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-[#666] text-xs">
            —
          </div>
        )}
      </td>

      {/* Item */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] text-white font-medium align-middle">
        {isProtected ? (
          <BlurredContent>{LOREM.medium}</BlurredContent>
        ) : (
          project.item || "—"
        )}
      </td>

      {/* Client */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] text-[#b0b0b0] align-middle">
        {isProtected ? (
          <BlurredContent>{LOREM.short}</BlurredContent>
        ) : (
          project.client || "—"
        )}
      </td>

      {/* Category */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] text-[#b0b0b0] align-middle">
        {isProtected ? (
          <BlurredContent>{LOREM.short}</BlurredContent>
        ) : (
          project.category || "—"
        )}
      </td>

      {/* Role */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] text-[#b0b0b0] align-middle">
        {isProtected ? (
          <BlurredContent>{LOREM.long}</BlurredContent>
        ) : (
          project.role || "—"
        )}
      </td>

      {/* Date */}
      <td className="px-3 py-2 border-r border-[#3a3a3a] text-[#888] font-mono text-sm align-middle">
        {isProtected ? (
          <BlurredContent>{LOREM.date}</BlurredContent>
        ) : (
          project.date || "—"
        )}
      </td>

      {/* Notes */}
      <td className="px-3 py-2 text-[#888] text-sm align-middle">
        <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#4a4a4a] scrollbar-track-transparent pr-1">
          {isProtected ? (
            <BlurredContent>{LOREM.notes}</BlurredContent>
          ) : (
            linkifyText(project.notes)
          )}
        </div>
      </td>
    </tr>
  );
}

