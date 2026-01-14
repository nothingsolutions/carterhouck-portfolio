import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project } from '@/types/project';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

/**
 * Get all projects from markdown files in the content/projects directory
 * Falls back to JSON data if no markdown files exist yet
 */
export function getAllProjects(): Project[] {
  // Check if content directory exists
  if (!fs.existsSync(projectsDirectory)) {
    console.warn('Content directory not found, falling back to JSON data');
    return getFallbackProjects();
  }

  const fileNames = fs.readdirSync(projectsDirectory);
  const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'));

  // If no markdown files exist yet, fall back to JSON
  if (markdownFiles.length === 0) {
    console.warn('No markdown files found, falling back to JSON data');
    return getFallbackProjects();
  }

  const projects = markdownFiles.map(fileName => {
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Convert frontmatter to Project type
    const project: Project = {
      id: data.id || '',
      images: data.images || [],
      item: data.item || '',
      client: data.client || '',
      category: data.category || '',
      role: data.role || '',
      date: data.date || '',
      program: data.program || '',
      supplier: data.supplier || '',
      notes: data.notes || '',
      status: data.status || 'Public',
    };

    return project;
  });

  return projects;
}

/**
 * Fallback to JSON data when markdown files don't exist yet
 */
function getFallbackProjects(): Project[] {
  try {
    const jsonPath = path.join(process.cwd(), 'data/projects.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    return data.projects || [];
  } catch (error) {
    console.error('Error reading fallback JSON data:', error);
    return [];
  }
}

/**
 * Get a single project by ID
 */
export function getProjectById(id: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find(project => project.id === id);
}

