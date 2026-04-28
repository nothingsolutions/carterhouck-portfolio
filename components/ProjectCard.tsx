"use client";

import type { Project } from "@/lib/projects";

const aspectClasses: Record<string, string> = {
  vertical:   "aspect-[3/4]",
  square:     "aspect-square",
  horizontal: "aspect-[4/3]",
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col w-full text-left cursor-pointer group focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
    >
      {/* Image area */}
      <div
        className={`${aspectClasses[project.orientation]} w-full relative overflow-hidden bg-gray-100 mb-1`}
      >
        {project.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageSrc}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Placeholder />
        )}
      </div>

      {/* Meta */}
      <div className="min-h-[44px]">
        <p className="text-[10px] font-mono leading-tight">{project.title}</p>
        <p className="text-[10px] font-mono leading-tight text-gray-500">{project.client}</p>
        <p className="text-[10px] font-mono leading-tight text-gray-400">{project.code}</p>
      </div>
    </button>
  );
}

function Placeholder() {
  return (
    <div className="absolute inset-0 bg-gray-100">
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
