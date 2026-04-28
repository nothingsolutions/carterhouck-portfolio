import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

interface ProjectRowProps {
  projects: Project[];
  startIndex: number;
  onCardClick: (index: number) => void;
}

export default function ProjectRow({
  projects,
  startIndex,
  onCardClick,
}: ProjectRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 items-end">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onCardClick(startIndex + i)}
        />
      ))}
    </div>
  );
}
