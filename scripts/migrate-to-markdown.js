/**
 * Migration script to convert projects.json to markdown files for Decap CMS
 * 
 * Run with: node scripts/migrate-to-markdown.js
 */

const fs = require('fs');
const path = require('path');

// Helper function to create a URL-friendly slug from a string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Read the projects JSON file
const projectsJsonPath = path.join(__dirname, '../data/projects.json');
const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));

// Create content directory if it doesn't exist
const contentDir = path.join(__dirname, '../content/projects');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

let successCount = 0;
let errorCount = 0;

console.log(`\nMigrating ${projectsData.projects.length} projects to markdown...\n`);

projectsData.projects.forEach((project) => {
  try {
    // Create a slug from the project title
    const slug = slugify(project.item || `project-${project.id}`);
    const filename = `${slug}.md`;
    const filepath = path.join(contentDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping ${filename} (already exists)`);
      return;
    }

    // Format images array for YAML
    const imagesYaml = project.images && project.images.length > 0
      ? project.images.map(img => `  - ${img}`).join('\n')
      : '';

    // Create markdown content with frontmatter
    const markdown = `---
id: "${project.id}"
item: "${project.item || ''}"
client: "${project.client || ''}"
category: "${project.category || ''}"
role: "${project.role || ''}"
date: "${project.date || ''}"
program: "${project.program || ''}"
supplier: "${project.supplier || ''}"
status: "${project.status || 'Public'}"
notes: "${(project.notes || '').replace(/"/g, '\\"')}"
images:
${imagesYaml || '  []'}
---
`;

    // Write the markdown file
    fs.writeFileSync(filepath, markdown, 'utf8');
    console.log(`✅ Created ${filename}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error processing project ${project.id}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Migration complete!`);
console.log(`   ✅ Successfully created: ${successCount} files`);
if (errorCount > 0) {
  console.log(`   ❌ Errors: ${errorCount}`);
}
console.log(`\nMarkdown files are in: ${contentDir}`);
console.log(`\nYou can now:`);
console.log(`  1. Test locally with: npm run dev`);
console.log(`  2. Commit and push to GitHub`);
console.log(`  3. Access your CMS at yoursite.com/admin\n`);

