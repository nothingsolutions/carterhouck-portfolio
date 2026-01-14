import { getAllProjects } from "@/lib/projects";
import Link from "next/link";

export default function ListPage() {
  const projects = getAllProjects();
  
  // Sort projects by date (most recent first)
  const sortedProjects = [...projects].sort((a, b) => {
    const parseDate = (dateStr: string): number => {
      if (!dateStr) return 0;
      const parts = dateStr.split(".");
      if (parts.length === 2) {
        const month = parseInt(parts[0], 10) || 0;
        const year = parseInt(parts[1], 10) || 0;
        return year * 100 + month;
      }
      const yearOnly = parseInt(dateStr, 10);
      if (!isNaN(yearOnly) && yearOnly > 1900 && yearOnly < 2100) {
        return yearOnly * 100 + 1;
      }
      return 0;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  // Filter to only show public/featured projects
  const visibleProjects = sortedProjects.filter(
    (p) => p.status === "Public" || p.status?.startsWith("Featured")
  );

  // Extract year from date string (e.g., "11.2025" -> "2025", "2024" -> "2024")
  const getYear = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split(".");
    if (parts.length === 2) {
      return parts[1];
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#c4c4c4]">
      {/* Header */}
      <header className="px-8 py-6">
        <Link href="/" className="text-[#c4c4c4] hover:text-white transition-colors text-sm">
          ← Back
        </Link>
      </header>

      {/* List */}
      <main className="px-8 pb-16">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_1fr] gap-8 mb-4 text-xs text-[#666] border-b border-[#222] pb-3">
          <div className="flex items-center gap-1">
            <span>↓</span> Yr.
          </div>
          <div>For</div>
          <div>Project</div>
        </div>

        {/* Table Body */}
        <div className="space-y-0">
          {visibleProjects.map((project, index) => (
            <a
              key={project.id || index}
              href="#"
              className="grid grid-cols-[80px_1fr_1fr] gap-8 py-3 hover:bg-[#111] transition-colors group"
            >
              <div className="text-[#888] font-medium">
                {getYear(project.date)}
              </div>
              <div className="font-semibold text-[#d4d4d4] group-hover:text-white transition-colors">
                {project.client || "—"}
              </div>
              <div className="font-semibold text-[#d4d4d4] group-hover:text-white transition-colors">
                {project.item}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

