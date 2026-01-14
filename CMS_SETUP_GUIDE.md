# Decap CMS Setup Guide

## What You Need to Do

### Step 1: Update Decap CMS Configuration

Edit `public/admin/config.yml` and update the GitHub repository information:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME  # Change this!
  branch: main  # or 'master' if that's your default branch
```

**Example:**
If your GitHub repo is at `https://github.com/carterhouck/portfolio`, then use:
```yaml
repo: carterhouck/portfolio
```

### Step 2: Enable GitHub OAuth in Vercel

Decap CMS needs GitHub OAuth to authenticate and commit changes. Here's how to set it up:

#### Option A: Using Vercel's Built-in OAuth (Easiest)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your portfolio project
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name:** `GITHUB_TOKEN`
   - **Value:** Your GitHub Personal Access Token (see below)
   - **Environment:** Production, Preview, and Development

#### Creating a GitHub Personal Access Token:

1. Go to GitHub: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name like "Portfolio CMS"
4. Set expiration (recommend "No expiration" for personal use)
5. Select these scopes:
   - ✅ **repo** (all sub-options)
6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again!)
8. Paste it into Vercel as the `GITHUB_TOKEN` value

#### Option B: Using GitHub OAuth App (More Complex, More Secure)

If you want proper OAuth flow:

1. Create a GitHub OAuth App:
   - Go to: https://github.com/settings/developers
   - Click **New OAuth App**
   - Fill in:
     - **Application name:** Portfolio CMS
     - **Homepage URL:** `https://yoursite.vercel.app`
     - **Authorization callback URL:** `https://api.netlify.com/auth/done`
       (Yes, use Netlify's callback - it works with Decap CMS)
   - Click **Register application**

2. Copy the **Client ID** and **Client Secret**

3. Add to Vercel Environment Variables:
   - `GITHUB_CLIENT_ID`: Your OAuth Client ID
   - `GITHUB_CLIENT_SECRET`: Your OAuth Client Secret

4. Update `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
  base_url: https://api.netlify.com  # OAuth provider
  auth_endpoint: auth
```

### Step 3: Deploy to Vercel

```bash
git add .
git commit -m "Add Decap CMS"
git push
```

Vercel will automatically deploy your changes.

### Step 4: Access Your CMS

Once deployed, visit:
```
https://yoursite.vercel.app/admin
```

You'll be prompted to authenticate with GitHub. After that, you can:
- ✅ Add new projects
- ✅ Edit existing projects
- ✅ Upload images
- ✅ Organize your portfolio

All changes will automatically commit to your GitHub repo and trigger a new Vercel deployment!

---

## Local Development (Optional)

To test the CMS locally:

1. Install Decap CMS proxy:
```bash
npx decap-server
```

2. In another terminal, run your Next.js dev server:
```bash
npm run dev
```

3. Uncomment this line in `public/admin/config.yml`:
```yaml
local_backend: true
```

4. Visit: `http://localhost:3000/admin`

You can now test the CMS locally without needing GitHub OAuth!

**Remember to comment out `local_backend: true` before deploying to production.**

---

## Using Your CMS

### Adding a New Project

1. Go to `yoursite.vercel.app/admin`
2. Click **Projects** → **New Projects**
3. Fill in the fields:
   - **ID:** Unique number (e.g., "100")
   - **Title:** Project name
   - **Client:** Client name
   - **Category:** Type of work
   - **Role:** Your role
   - **Date:** Format as "MM.YYYY" (e.g., "01.2026")
   - **Status:** Choose visibility (Public, Featured 1-3, Login Required, Archived)
   - **Images:** Drag and drop images
4. Click **Publish**

The CMS will:
- Create a markdown file in `content/projects/`
- Upload images to `public/uploads/`
- Commit changes to GitHub
- Trigger Vercel to rebuild your site (~2 minutes)

### Editing a Project

1. Go to `yoursite.vercel.app/admin`
2. Click on any project in the list
3. Make your changes
4. Click **Publish**

### Featured Projects

Set **Status** to:
- **Featured 1** - Appears first
- **Featured 2** - Appears second
- **Featured 3** - Appears third
- **Public** - Regular project (sorted by date)
- **Login Required** - Only visible with password
- **Archived** - Hidden from public view

---

## Troubleshooting

### "Config file not found"
- Make sure you've deployed the changes to Vercel
- Check that `public/admin/config.yml` exists

### "Error loading config.yml"
- Verify YAML syntax is correct (no extra spaces/tabs)
- Make sure you updated the `repo:` field

### "Authentication failed"
- Check your `GITHUB_TOKEN` in Vercel environment variables
- Make sure the token has `repo` permissions
- Try regenerating the GitHub token

### CMS shows but can't save
- Verify your GitHub token has write permissions
- Check that the repo name in config.yml matches your actual repo

### Images not showing
- Check that images are uploaded to `public/uploads/`
- Verify the `public_folder` setting in config.yml is `/uploads`

---

## File Structure

```
your-portfolio/
├── content/
│   └── projects/           # Project markdown files (auto-created by CMS)
│       ├── project-1.md
│       └── project-2.md
├── public/
│   ├── admin/              # Decap CMS admin interface
│   │   ├── config.yml      # CMS configuration
│   │   └── index.html      # CMS interface
│   ├── uploads/            # Images uploaded via CMS
│   └── images/             # Your original images
├── lib/
│   └── projects.ts         # Utility to read markdown files
└── app/
    └── page.tsx            # Homepage (reads from markdown)
```

---

## Need Help?

If you run into issues:
1. Check Vercel deployment logs
2. Check browser console for errors at `/admin`
3. Verify your GitHub token permissions
4. Try the local development setup first

Happy content managing! 🎨

