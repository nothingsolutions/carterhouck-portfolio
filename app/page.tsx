import ProjectsContainer from "@/components/ProjectsContainer";
import TypedBio from "@/components/TypedBio";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-[#3a3a3a]">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Carter Houck
              </h1>
              <TypedBio />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />
            </div>
          </div>
        </div>
        {/* Accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C1121E] to-transparent header-shimmer" />
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto">
        {/* Spreadsheet container */}
        <ProjectsContainer projects={projects} />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-[#2a2a2a] mt-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-[#888] font-mono text-center leading-relaxed mb-6">
              Carter Houck is worth the risk. New York City.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs font-mono">
              <a
                href="mailto:carter@nothingradio.com"
                className="text-[#666] hover:text-[#C1121E] transition-colors"
              >
                carter@nothingradio.com
              </a>
              <span className="text-[#3a3a3a]">•</span>
              <a
                href="https://instagram.com/carterhouck"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-[#C1121E] transition-colors"
              >
                @carterhouck
              </a>
              <span className="text-[#3a3a3a]">•</span>
              <span className="text-[#555]">New York, NY</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
