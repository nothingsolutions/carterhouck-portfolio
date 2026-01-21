import ProjectsContainer from "@/components/ProjectsContainer";
import Header from "@/components/Header";
import { getAllProjects } from "@/lib/projects";

export default function Home() {
  // Get projects from markdown files (falls back to JSON if no markdown exists)
  const projects = getAllProjects();

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

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
      </main>
    </div>
  );
}
