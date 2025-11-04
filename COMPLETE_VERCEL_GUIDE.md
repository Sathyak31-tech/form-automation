# Complete Vercel Deployment Guide - Step by Step

This guide will walk you through deploying your Form Automation project to Vercel from start to finish.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Understanding the Architecture](#understanding-the-architecture)
3. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
4. [Step 2: Deploy Backend (Railway)](#step-2-deploy-backend-railway)
5. [Step 3: Deploy Frontend (Vercel)](#step-3-deploy-frontend-vercel)
6. [Step 4: Connect Frontend to Backend](#step-4-connect-frontend-to-backend)
7. [Step 5: Test Your Deployment](#step-5-test-your-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:

- ✅ GitHub account
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Railway account (sign up at [railway.app](https://railway.app)) - for backend
- ✅ Your code pushed to GitHub

---

## Understanding the Architecture

Your project has two parts:

1. **Frontend** (React app) → Deploy to **Vercel**
2. **Backend** (Flask server) → Deploy to **Railway** (or Render/Heroku)

**Why separate?**
- Vercel is optimized for static sites and serverless functions
- Flask backends need a platform that supports long-running Python processes
- Railway/Render are perfect for Flask applications

---

## Step 1: Prepare Your Code

### 1.1 Verify Your Project Structure

Make sure your project looks like this:

```
form_automation/
├── frontend/
│   ├── public/
│   │   └── index.html        ✅ Must exist
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── server.py
│   ├── populator.py
│   └── requirements.txt
├── vercel.json              ✅ Should exist
└── README.md
```

### 1.2 Verify vercel.json

Check that `vercel.json` in the root directory contains:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 1.3 Verify Frontend Code Uses Environment Variables

Check `frontend/src/components/ProcessForms.js` - it should use:
```javascript
const apiUrl = process.env.REACT_APP_API_URL || '';
```

### 1.4 Commit and Push to GitHub

```bash
# Make sure all changes are committed
git status

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

---

## Step 2: Deploy Backend (Railway)

**Why deploy backend first?** You need the backend URL to configure the frontend.

### 2.1 Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your repository: `Sathyak31-tech/form-automation`
4. Click **"Deploy Now"**

### 2.3 Configure the Service

1. Railway will detect it's a Python project
2. Click on the service to configure it
3. Go to **Settings** tab
4. Set the following:

   **Root Directory:**
   - Set to: `backend`

   **Start Command:**
   - Set to: `python server.py`

### 2.4 Set Environment Variables (Optional)

In Railway Settings → Variables, you can add:

```
ALLOWED_ORIGINS=*
```

(This allows all origins - you can restrict later)

### 2.5 Wait for Deployment

1. Railway will automatically:
   - Install dependencies from `backend/requirements.txt`
   - Run `python server.py`
   - Generate a public URL

2. Wait for the deployment to complete (2-5 minutes)

### 2.6 Get Your Backend URL

1. Once deployed, Railway will show a URL like:
   ```
   https://your-project-name.up.railway.app
   ```

2. **Test it:**
   ```bash
   curl https://your-project-name.up.railway.app/api/health
   ```
   Should return: `{"status": "healthy"}`

3. **Save this URL** - you'll need it for Step 4!

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

### 3.2 Import Your Project

1. Click **"Add New Project"** or **"Import Project"**
2. You'll see your GitHub repositories
3. Find and click on: **`Sathyak31-tech/form-automation`**
4. Click **"Import"**

### 3.3 Configure Project Settings

You'll see a form with these fields:

#### **Vercel Team**
- Keep the default (your team)

#### **Project Name**
- Default: `form-automation`
- You can change it if you want

#### **Framework Preset**
- Default: **"Other"** or **"Create React App"**
- Keep it as is (Vercel will auto-detect)

#### **Root Directory** ⚠️ IMPORTANT
- Click **"Edit"** next to the field
- Change from: `./`
- Change to: `frontend`
- Click **"Continue"**

#### **Build and Output Settings**
- Click to expand this section
- **Build Command:** Leave blank (Vercel uses `vercel.json`)
- **Output Directory:** Leave blank (Vercel uses `vercel.json`)
- OR set manually:
  - Build Command: `npm run build`
  - Output Directory: `build`

#### **Environment Variables** ⚠️ IMPORTANT
- Click to expand this section
- Click **"Add"** or **"+"** button
- Add new variable:
  - **Key:** `REACT_APP_API_URL`
  - **Value:** Your Railway backend URL (from Step 2.6)
    - Example: `https://your-project-name.up.railway.app`
  - **Environment:** Check all three:
    - ✅ Production
    - ✅ Preview  
    - ✅ Development
- Click **"Save"**

### 3.4 Deploy

1. Review all settings
2. Click **"Deploy"** button at the bottom
3. Wait for deployment (2-5 minutes)

### 3.5 Watch the Build

You'll see the build logs:
- Installing dependencies
- Building the project
- Any errors (hopefully none!)

### 3.6 Get Your Frontend URL

Once deployment completes:
- Vercel will show you a URL like:
  ```
  https://form-automation.vercel.app
  ```
- **Save this URL!**

---

## Step 4: Connect Frontend to Backend

### 4.1 Update Backend CORS (Important!)

Your backend needs to allow requests from your Vercel frontend.

1. Go to Railway dashboard
2. Find your backend service
3. Go to **Settings** → **Variables**
4. Add/Update:
   ```
   ALLOWED_ORIGINS=https://form-automation.vercel.app,https://form-automation-*.vercel.app
   ```
   (Replace with your actual Vercel URL)

5. Railway will automatically redeploy with the new setting

### 4.2 Verify Environment Variable in Vercel

1. Go to Vercel dashboard
2. Your project → **Settings** → **Environment Variables**
3. Verify `REACT_APP_API_URL` is set correctly
4. If you need to change it:
   - Click the variable
   - Update the value
   - Click **"Save"**
   - Redeploy (Vercel will ask or auto-redeploy)

---

## Step 5: Test Your Deployment

### 5.1 Test Frontend

1. Visit your Vercel URL: `https://form-automation.vercel.app`
2. You should see your React app
3. Check browser console (F12) for any errors

### 5.2 Test Backend Connection

1. In your Vercel-deployed app, try to:
   - Fill out the form
   - Click "Process Forms"
2. Check if it connects to the backend

### 5.3 Common Issues to Check

- ✅ Frontend loads without errors
- ✅ No CORS errors in browser console
- ✅ Form submission works
- ✅ Files are generated and downloadable

---

## Troubleshooting

### Issue: "Could not find index.html"

**Solution:**
- Make sure Root Directory is set to `frontend` in Vercel
- Verify `vercel.json` has correct paths
- Check that `frontend/public/index.html` exists

### Issue: "Build failed"

**Solution:**
- Check Vercel build logs for specific errors
- Verify all dependencies are in `package.json`
- Make sure Node.js version is compatible (Vercel uses 18+)

### Issue: "API calls fail" or "CORS error"

**Solution:**
1. Check `REACT_APP_API_URL` is set correctly in Vercel
2. Verify backend CORS allows your Vercel domain
3. Test backend URL directly: `curl https://your-backend.railway.app/api/health`
4. Check browser console for specific error messages

### Issue: "404 on routes"

**Solution:**
- Make sure `vercel.json` has the rewrites rule
- Verify the rewrite destination is `/index.html`

### Issue: "Backend not responding"

**Solution:**
1. Check Railway deployment logs
2. Verify `server.py` is running
3. Check Railway service is "Running" (not paused)
4. Test backend health endpoint directly

---

## Quick Reference: URLs to Save

After deployment, save these URLs:

1. **Frontend (Vercel):**
   ```
   https://form-automation.vercel.app
   ```

2. **Backend (Railway):**
   ```
   https://your-project-name.up.railway.app
   ```

3. **Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

4. **Railway Dashboard:**
   ```
   https://railway.app/dashboard
   ```

---

## Next Steps

After successful deployment:

1. ✅ **Set up custom domain** (optional)
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

2. ✅ **Monitor deployments**
   - Both platforms auto-deploy on git push
   - Check logs regularly

3. ✅ **Set up environment-specific variables**
   - Production vs Preview vs Development

4. ✅ **Enable analytics** (optional)
   - Vercel Analytics
   - Railway Metrics

---

## Summary Checklist

Before deploying:
- [ ] Code is pushed to GitHub
- [ ] `vercel.json` exists and is correct
- [ ] Frontend uses `REACT_APP_API_URL` environment variable
- [ ] `frontend/public/index.html` exists

Backend deployment:
- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] Backend URL saved
- [ ] Backend health check works

Frontend deployment:
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root Directory set to `frontend`
- [ ] `REACT_APP_API_URL` environment variable set
- [ ] Deployment successful

Connection:
- [ ] Backend CORS updated with Vercel URL
- [ ] Frontend can connect to backend
- [ ] Forms can be processed
- [ ] Files can be downloaded

---

## Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review **Vercel build logs** for specific errors
3. Review **Railway deployment logs**
4. Check browser console for frontend errors
5. Test backend endpoints directly with `curl`

---

**Good luck with your deployment! 🚀**

