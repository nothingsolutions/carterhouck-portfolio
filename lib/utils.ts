/**
 * Client-safe utility functions
 */

/**
 * Generate URL-friendly slug from project name
 * This function can be used in both client and server components
 */
export function generateSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

