# TinaCMS Setup Guide

This project uses TinaCMS for local content management. The CMS runs entirely locally and edits files directly in your repository.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the CMS:**
   ```bash
   npm run cms:dev
   ```
   
   This will start both Next.js dev server and TinaCMS. Access the admin at `http://localhost:3000/admin`

## Usage

1. **Edit Content:**
   - Navigate to `http://localhost:3000/admin` in your browser
   - Edit projects using the visual interface
   - Changes are saved directly to `data/projects.json`

2. **Deploy Changes:**
   ```bash
   git add .
   git commit -m "Update projects via CMS"
   git push origin main
   ```
   
   GitHub Pages will automatically deploy your changes (if using GitHub Actions workflow)

## Configuration

- **TinaCMS Config:** `tina/config.ts` - Defines the content schema
- **Admin Route:** `app/admin/page.tsx` - Serves the CMS admin interface
- **GitHub Actions:** `.github/workflows/deploy.yml` - Automated deployment workflow

## Notes

- The CMS is only available in development mode for security
- All changes are version controlled through Git
- The `projects.json` file structure is an array - TinaCMS should handle this, but you may need to adjust the collection configuration in `tina/config.ts` if you encounter issues

## Troubleshooting

If the CMS doesn't load:
1. Make sure `npm run cms:dev` is running
2. Check that TinaCMS packages are installed: `npm list tinacms @tinacms/cli`
3. Verify the `tina/config.ts` file is correctly formatted

