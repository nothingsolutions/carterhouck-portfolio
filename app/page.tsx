"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProjectRow from "@/components/ProjectRow";
import ImageLightbox from "@/components/ImageLightbox";
import { projects, getProjectGroups } from "@/lib/projects";

const SECTION_LABELS: Record<number, string> = {
  1: "Featured",
  2: "Ongoing / Most Recent",
};

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const projectGroups = getProjectGroups();
  const groupNumbers = Object.keys(projectGroups).map(Number).sort((a, b) => a - b);

  // Compute the flat index offset for each group so lightbox navigates across all projects
  const groupStartIndices: Record<number, number> = {};
  let offset = 0;
  for (const g of groupNumbers) {
    groupStartIndices[g] = offset;
    offset += projectGroups[g].length;
  }

  const total = projects.length;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <div className="px-3 pb-16 space-y-12 md:space-y-16">
        {groupNumbers.map((g) => (
          <section key={g} className="space-y-2 md:space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wide">
              {SECTION_LABELS[g] ?? `Section ${g}`}
            </p>
            <ProjectRow
              projects={projectGroups[g]}
              startIndex={groupStartIndices[g]}
              onCardClick={setLightboxIndex}
            />
          </section>
        ))}
      </div>

      <SiteFooter />

      {lightboxIndex !== null && (
        <ImageLightbox
          projects={projects}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => ((i ?? 0) - 1 + total) % total)}
          onNext={() => setLightboxIndex((i) => ((i ?? 0) + 1) % total)}
        />
      )}
    </main>
  );
}
