"use client";

import Link from "next/link";
import { Project } from "@/types/project";
import { generateSlug } from "@/lib/utils";

interface SimpleProjectListProps {
  projects: Project[];
}

export default function SimpleProjectList({ projects }: SimpleProjectListProps) {
  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/project/${generateSlug(project.item)}`}
          className="flex items-baseline gap-4 py-2 px-4 hover:bg-[#2a2a2a] transition-colors group"
        >
          {/* Year/Date */}
          <span className="text-[#666] font-mono text-sm min-w-[80px] group-hover:text-[#888]">
            {project.date || "—"}
          </span>

          {/* Client */}
          <span className="text-[#888] text-sm min-w-[150px] group-hover:text-[#aaa]">
            {project.client || "—"}
          </span>

          {/* Project Title */}
          <span className="text-white text-sm group-hover:text-[#4a9eff] transition-colors">
            {project.item}
          </span>
        </Link>
      ))}
    </div>
  );
}

