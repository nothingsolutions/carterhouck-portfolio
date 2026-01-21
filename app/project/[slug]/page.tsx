import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { generateSlug } from "@/lib/utils";
import ProjectDetail from "@/components/ProjectDetail";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Carter Houck",
    };
  }

  const title = `${project.item} - ${project.client} | Carter Houck`;
  const description = project.notes || `${project.category} project for ${project.client}. Role: ${project.role}. ${project.date}`;
  const imageUrl = project.images[0] || "/photowall/carterhouck-01.png";

  return {
    title,
    description,
    keywords: [
      project.item,
      project.client,
      project.category,
      project.role,
      "Carter Houck",
      "graphic design",
      "NYC designer",
      "event management",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.item} - ${project.client}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // Return 404 if project not found
  if (!project) {
    notFound();
  }

  // Get all projects for the bottom spreadsheet
  const allProjects = getAllProjects();

  return <ProjectDetail project={project} allProjects={allProjects} />;
}

// Optional: Generate static params for build optimization
// Uncomment if you want to pre-generate pages at build time
// export function generateStaticParams() {
//   const projects = getAllProjects();
//   return projects.map((project) => ({
//     slug: generateSlug(project.item),
//   }));
// }

