# 🚀 AI Mutual Fund Engine PRO - Deployment Guide

## Get Your FREE Permanent Link in 5 Minutes!

---

## Option 1: Vercel Deployment (Recommended - Easiest)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New Repository"** (green button)
3. Name it: `ai-mutual-fund-engine`
4. Make it **Public** or **Private**
5. Click **"Create repository"**

### Step 2: Push Code to GitHub

If you downloaded this code, run these commands in terminal:

```bash
cd your-project-folder
git init
git add .
git commit -m "Initial commit - AI Mutual Fund Engine PRO"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-mutual-fund-engine.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select your `ai-mutual-fund-engine` repository
5. Vercel auto-detects Vite → Click **"Deploy"**
6. Wait 1-2 minutes...
7. ✅ **Done!** Your app is live at: `https://ai-mutual-fund-engine.vercel.app`

### Step 4: Add Supabase (Optional - For Data Persistence)

1. Go to Vercel Project → **Settings** → **Environment Variables**
2. Add these:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **"Redeploy"**

---

## Option 2: Netlify Deployment

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag & drop the `dist` folder to Netlify
4. ✅ **Done!** Your app is live!

### Or connect GitHub:
1. Click **"Add new site"** → **"Import an existing project"**
2. Select GitHub and authorize
3. Choose your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **"Deploy site"**

---

## Supabase Setup (FREE Database)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New Project"**
5. Fill in:
   - **Name**: `ai-mutual-fund-db`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 2 minutes for setup...

### Step 2: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy ALL contents from `supabase-schema.sql` file
4. Paste into the editor
5. Click **"Run"** (or Ctrl+Enter)
6. You should see: "Schema created successfully!"

### Step 3: Get API Keys

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (long string)

### Step 4: Add to Vercel

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGci...
   ```
4. Click **"Save"**
5. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## Custom Domain (Optional)

### On Vercel:
1. Project **Settings** → **Domains**
2. Add your domain: `funds.yourdomain.com`
3. Update DNS at your registrar:
   - Type: `CNAME`
   - Name: `funds`
   - Value: `cname.vercel-dns.com`

### On Netlify:
1. **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS instructions

---

## Auto-Updates

### Enable Auto-Deploy on Vercel:
Your app automatically redeploys when you push to GitHub!

```bash
# Make changes, then:
git add .
git commit -m "Update feature"
git push
# Vercel auto-deploys in ~1 minute!
```

---

## Troubleshooting

### Build fails?
```bash
# Try locally first:
npm install
npm run build
```

### CORS errors with AMFI API?
- The app uses fallback CORS proxies automatically
- If all fail, it uses simulated data

### Supabase not connecting?
1. Check environment variable names (must start with `VITE_`)
2. Redeploy after adding env vars
3. Check Supabase dashboard for errors

---

## Summary: Quick Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎉 Congratulations!

Your AI Mutual Fund Engine PRO is now:
- ✅ Live on the internet forever (FREE)
- ✅ Fetching real NAV data from AMFI
- ✅ Storing data in Supabase (if configured)
- ✅ Auto-deploys on code changes
- ✅ Free SSL certificate included

**Your Permanent URL**: `https://your-app.vercel.app`

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- AMFI Data: https://www.amfiindia.com

