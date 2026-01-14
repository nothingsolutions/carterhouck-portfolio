# GitHub OAuth App Setup for Decap CMS

## Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Carter Portfolio CMS`
   - **Homepage URL:** `https://www.carterhouck.com`
   - **Authorization callback URL:** `https://www.carterhouck.com/api/auth`
4. Click **"Register application"**
5. **Copy the Client ID** (you'll see it immediately)
6. Click **"Generate a new client secret"**
7. **Copy the Client Secret** (you'll only see it once!)

## Step 2: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your portfolio project
3. Go to **Settings** → **Environment Variables**
4. Add these TWO variables:

| Name | Value |
|------|-------|
| `GITHUB_CLIENT_ID` | Your OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Your OAuth App Client Secret |

5. Make sure both are enabled for **Production**, **Preview**, and **Development**
6. Click **Save**

## Step 3: Redeploy

After adding the environment variables, you need to redeploy:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2 minutes)

## Step 4: Test

Visit: `https://www.carterhouck.com/admin`

1. Click **"Login with GitHub"**
2. Authorize the app
3. You should be redirected back and logged in!

---

## Important Notes

- **Keep your Client Secret private!** Never commit it to Git.
- The `GITHUB_TOKEN` you created earlier is no longer needed (you can remove it from Vercel if you want)
- OAuth is more secure because users authenticate directly with GitHub

## Troubleshooting

### "Client ID not found"
- Make sure `GITHUB_CLIENT_ID` is set in Vercel Environment Variables
- Redeploy after adding the variable

### "Redirect URI mismatch"
- Make sure the callback URL in your GitHub OAuth App matches exactly:
  `https://www.carterhouck.com/api/auth`

### "Access denied"
- Make sure `GITHUB_CLIENT_SECRET` is correct
- Try regenerating the secret in GitHub and updating Vercel

