"use client";

import { Project } from "@/types/project";
import Header from "./Header";
import MasonryGrid from "./MasonryGrid";
import SimpleProjectList from "./SimpleProjectList";
import { extractVideoUrl } from "./ImageGallery";

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
}

export default function ProjectDetail({ project, allProjects }: ProjectDetailProps) {
  const videoUrl = extractVideoUrl(project.notes);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Header />

      {/* Centered Hero Header */}
      <header className="max-w-4xl mx-auto px-4 py-12 text-center">
        {/* Client Name */}
        <div className="text-[#888] text-sm uppercase tracking-wider font-semibold mb-3">
          {project.client || "—"}
        </div>

        {/* Project Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          {project.item}
        </h1>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-left max-w-2xl mx-auto">
          {/* Category */}
          {project.category && (
            <div>
              <div className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1">
                Category
              </div>
              <div className="text-white text-sm font-medium">
                {project.category}
              </div>
            </div>
          )}

          {/* Role */}
          {project.role && (
            <div>
              <div className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1">
                Role
              </div>
              <div className="text-white text-sm font-medium">
                {project.role}
              </div>
            </div>
          )}

          {/* Date */}
          {project.date && (
            <div>
              <div className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1">
                Date
              </div>
              <div className="text-white text-sm font-medium font-mono">
                {project.date}
              </div>
            </div>
          )}

          {/* Program */}
          {project.program && (
            <div>
              <div className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1">
                Program
              </div>
              <div className="text-white text-sm font-medium">
                {project.program}
              </div>
            </div>
          )}
        </div>

        {/* Notes Section - Prominent */}
        {project.notes && !videoUrl && (
          <div className="border-t border-[#3a3a3a] pt-8">
            <div className="text-[#888] text-xs uppercase tracking-wider font-semibold mb-3">
              About this project
            </div>
            <p className="text-[#b0b0b0] text-base leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
              {project.notes}
            </p>
          </div>
        )}
      </header>

      {/* Divider */}
      <div className="max-w-[1800px] mx-auto px-4 py-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent" />
      </div>

      {/* Masonry Photo Grid */}
      <section className="max-w-[1800px] mx-auto py-12">
        <MasonryGrid 
          images={project.images} 
          videoUrl={videoUrl}
          projectName={project.item}
        />
      </section>

      {/* Divider */}
      <div className="max-w-[1800px] mx-auto px-4 py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent" />
      </div>

      {/* All Projects Section */}
      <section className="max-w-[1800px] mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">
          All Projects
        </h2>
        <SimpleProjectList projects={allProjects} />
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#2a2a2a] mt-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-[#888] font-mono text-center leading-relaxed mb-6">
            Carter Houck is worth the risk. New York City.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs font-mono">
            <a
              href="mailto:carter@nothingradio.com"
              className="text-[#666] hover:text-[#4a9eff] transition-colors"
            >
              carter@nothingradio.com
            </a>
            <span className="text-[#3a3a3a]">•</span>
            <a
              href="https://instagram.com/carterhouck"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-[#4a9eff] transition-colors"
            >
              @carterhouck
            </a>
            <span className="text-[#3a3a3a]">•</span>
            <span className="text-[#555]">New York, NY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

