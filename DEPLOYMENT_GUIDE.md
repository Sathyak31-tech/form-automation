# Complete Deployment Guide - Frontend + Backend Separate

This guide will help you deploy the frontend on Vercel and the backend on Railway.

## 🎯 Overview

- **Frontend**: Deploy on Vercel (React app)
- **Backend**: Deploy on Railway (Python Flask app)

---

## Part 1: Deploy Backend on Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `form-automation`
4. Railway will auto-detect Python

### Step 3: Configure Backend Service
1. Railway will create a service automatically
2. Click on the service
3. Go to "Settings" tab
4. Set these configurations:

**Root Directory**: Leave empty (or set to `backend` if you want)

**Build Command**: 
```bash
pip install -r backend/requirements.txt
```

**Start Command**:
```bash
cd backend && python server.py
```

**Environment Variables** (if needed):
- `FLASK_ENV=production`
- `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app` (set after frontend is deployed)

### Step 4: Get Backend URL
1. After deployment, Railway will give you a URL like: `https://your-app.railway.app`
2. Note this URL - you'll need it for the frontend

### Step 5: Test Backend
Visit: `https://your-app.railway.app/api/health`
Should return: `{"status": "healthy"}`

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Update Frontend to Use Backend URL
The frontend needs to know where the backend is.

**Option A: Environment Variable (Recommended)**
1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-app.railway.app`
3. Redeploy

**Option B: Update Code Directly**
I'll update the code to use an environment variable.

### Step 2: Deploy Frontend
1. Go to https://vercel.com
2. Your project should already be connected
3. Every push to GitHub will auto-deploy
4. Or manually trigger deployment from dashboard

### Step 3: Update CORS in Backend
After frontend is deployed, update Railway environment variable:
- `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`

---

## Part 3: File Structure for Railway

Railway needs to know which files to use. Ensure your project has:

```
form-automation/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── populator.py (or reference to lib/populator.py)
├── lib/
│   └── populator.py
├── templates/
│   └── *.docx files
└── ... (other files)
```

---

## Part 4: Update Backend for Production

The backend needs to:
1. Copy templates to a location Railway can access
2. Handle CORS properly
3. Use environment variables for configuration

---

## Quick Checklist

- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] Backend URL obtained
- [ ] Frontend updated with backend URL
- [ ] Frontend deployed on Vercel
- [ ] CORS configured in backend
- [ ] Test: Frontend can call backend API

---

## Troubleshooting

### Backend not starting
- Check Railway logs for errors
- Verify `requirements.txt` has all dependencies
- Check if `server.py` is in the correct directory

### CORS errors
- Update `ALLOWED_ORIGINS` in Railway environment variables
- Include both frontend URL and `http://localhost:3000` for local testing

### Templates not found
- Ensure `templates/` folder is in the repository
- Check if Railway can access the templates directory

---

Let me know when you're ready and I'll help you with each step!

