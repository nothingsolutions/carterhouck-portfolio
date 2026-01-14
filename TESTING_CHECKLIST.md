# Testing Checklist for Decap CMS

## ✅ Pre-Deployment Checklist

Before pushing to GitHub, make sure:

- [ ] **Updated `public/admin/config.yml`**
  - [ ] Changed `repo:` to your actual GitHub username/repo name
  - [ ] Set correct `branch:` (main or master)

- [ ] **Verified local build works**
  - [ ] Run `npm run build` - should complete without errors
  - [ ] Check that all 67 projects show up on homepage

## 📝 Local Testing (Optional but Recommended)

To test the CMS locally before deploying:

1. **Enable local backend** (uncomment in `public/admin/config.yml`):
   ```yaml
   local_backend: true
   ```

2. **Start the Decap proxy server** (in one terminal):
   ```bash
   npx decap-server
   ```

3. **Start Next.js dev server** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Test the CMS**:
   - Visit: `http://localhost:3000/admin`
   - Try creating a test project
   - Upload a test image
   - Verify it saves correctly

5. **Don't forget**: Comment out `local_backend: true` before deploying!

## 🚀 Deployment Steps

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Add Decap CMS for portfolio management"
   git push
   ```

2. **Set up GitHub OAuth in Vercel**:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your GitHub Personal Access Token
   - See `CMS_SETUP_GUIDE.md` for detailed instructions

3. **Wait for Vercel deployment** (~2 minutes)

## 🧪 Post-Deployment Testing

Once deployed, test the complete workflow:

### Test 1: Access CMS
- [ ] Visit `https://yoursite.vercel.app/admin`
- [ ] Should see Decap CMS login screen
- [ ] Click "Login with GitHub"
- [ ] Authenticate successfully

### Test 2: View Existing Projects
- [ ] Can see all 67 projects in the CMS
- [ ] Projects display correct data (title, client, images, etc.)
- [ ] Can search/filter projects

### Test 3: Edit Existing Project
- [ ] Click on any project (e.g., "Bottle Opener Necklace")
- [ ] Edit the title or notes
- [ ] Click "Publish"
- [ ] Check GitHub - should see new commit
- [ ] Wait ~2 minutes for Vercel rebuild
- [ ] Visit your site - changes should be live

### Test 4: Add New Project
- [ ] Click "New Projects" in CMS
- [ ] Fill in required fields:
  - ID: "test-100"
  - Title: "Test Project"
  - Client: "Test Client"
  - Category: "Testing"
  - Date: "01.2026"
  - Status: "Public"
- [ ] Upload a test image (drag & drop)
- [ ] Click "Publish"
- [ ] Check GitHub - should see:
  - New file: `content/projects/test-project.md`
  - New image: `public/uploads/[your-image].jpg`
- [ ] Wait ~2 minutes for Vercel rebuild
- [ ] Refresh your site - new project should appear

### Test 5: Featured Projects
- [ ] Edit a project
- [ ] Change Status to "Featured 1"
- [ ] Publish
- [ ] Wait for rebuild
- [ ] Verify project appears at the top of your portfolio

### Test 6: Delete Test Project
- [ ] Find the test project you created
- [ ] Delete it (or change status to "Archived")
- [ ] Publish
- [ ] Verify it's removed from site after rebuild

## 🐛 Troubleshooting

If something doesn't work:

### CMS won't load
- Check browser console for errors
- Verify `public/admin/config.yml` exists
- Check YAML syntax is valid (no extra spaces)

### Can't authenticate
- Verify `GITHUB_TOKEN` is set in Vercel
- Check token has `repo` permissions
- Try regenerating the token

### Changes don't show on site
- Check GitHub - commits should be visible
- Check Vercel deployments - should trigger automatically
- Clear browser cache
- Wait full 2-3 minutes for rebuild

### Images not displaying
- Check images are in `public/uploads/`
- Verify image paths start with `/uploads/`
- Check file permissions in GitHub

## ✨ Success Criteria

Your CMS is working correctly when:
- ✅ Can login via GitHub OAuth
- ✅ Can view all existing projects
- ✅ Can edit projects and changes deploy automatically
- ✅ Can add new projects with images
- ✅ Images upload and display correctly
- ✅ Changes commit to GitHub automatically
- ✅ Vercel rebuilds site automatically
- ✅ All changes appear on live site within 2-3 minutes

## 📚 Next Steps

Once everything works:
1. Delete any test projects you created
2. Start managing your real portfolio content!
3. Bookmark `yoursite.vercel.app/admin` for easy access
4. Consider setting up a custom domain if you haven't

## 🎉 You're Done!

You now have a fully functional, serverless CMS for your portfolio. No database, no backend server, just simple markdown files in Git!

**To add content in the future:**
1. Visit yoursite.com/admin
2. Click "New Projects"
3. Fill in details
4. Upload images
5. Click "Publish"
6. Done! (automatically deploys in ~2 min)

