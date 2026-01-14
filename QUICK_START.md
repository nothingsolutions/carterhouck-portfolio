# 🚀 Quick Start - Get Your CMS Running in 5 Minutes

## ✅ What's Already Done

- ✅ Decap CMS installed and configured
- ✅ All 67 projects migrated to markdown
- ✅ Admin interface ready at `/admin`
- ✅ Image upload system configured
- ✅ Next.js integration complete
- ✅ Build tested and working

## 🎯 What YOU Need to Do (3 Steps)

### Step 1: Update CMS Config (30 seconds)

Open `public/admin/config.yml` and change line 3:

```yaml
repo: carterhouck/YOUR_REPO_NAME  # ⚠️ Replace with your actual repo name
```

**Find your repo name:** It's in your GitHub URL after your username.  
Example: `github.com/carterhouck/portfolio` → use `carterhouck/portfolio`

### Step 2: Create GitHub Token (2 minutes)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: "Portfolio CMS"
4. Expiration: "No expiration" (or your preference)
5. Check ✅ **repo** (this gives full repo access)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)

### Step 3: Add Token to Vercel (1 minute)

1. Go to: https://vercel.com/dashboard
2. Click on your portfolio project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
   - **Name:** `GITHUB_TOKEN`
   - **Value:** [paste your token from Step 2]
   - **Environments:** Check all 3 (Production, Preview, Development)
5. Click **"Save"**

## 🚀 Deploy (1 minute)

```bash
git add .
git commit -m "Add Decap CMS"
git push
```

Wait ~2 minutes for Vercel to deploy.

## 🎉 Use Your CMS!

Visit: **`https://yoursite.vercel.app/admin`**

1. Click "Login with GitHub"
2. Authenticate
3. See all your projects!
4. Click "New Projects" to add content
5. Changes auto-deploy to your site

---

## 📚 Need More Help?

- **CMS_SETUP_GUIDE.md** - Detailed setup instructions
- **TESTING_CHECKLIST.md** - Complete testing workflow
- **DECAP_CMS_SUMMARY.md** - Full overview of changes

## 💡 Quick Tips

- **Add Project:** Visit `/admin` → "New Projects" → Fill form → Upload images → Publish
- **Edit Project:** Click any project → Make changes → Publish
- **Featured Projects:** Set Status to "Featured 1", "Featured 2", or "Featured 3"
- **Changes go live in ~2 minutes** after publishing

## ⚠️ Common Issues

**"Can't login"** → Check GitHub token in Vercel  
**"Config error"** → Make sure you updated `repo:` in config.yml  
**"Images not showing"** → Wait full 2-3 minutes for Vercel to rebuild  

---

**That's it!** You now have a serverless CMS with zero monthly costs. 🎨✨

