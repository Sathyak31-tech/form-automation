# Complete Backend Deployment Guide

This guide will walk you through deploying your Flask backend to Railway (recommended) or Render (alternative).

## 🎯 Where to Deploy Backend?

Your Flask backend needs a platform that supports:
- ✅ Python/Flask applications
- ✅ Long-running processes
- ✅ File system access
- ✅ Environment variables

**Recommended Options:**
1. **Railway** (⭐ Recommended - Easiest)
2. **Render** (Free tier available)
3. **Heroku** (Paid, but reliable)
4. **PythonAnywhere** (Good for beginners)

---

## 🚀 Option 1: Deploy to Railway (Recommended)

### Why Railway?
- ✅ Free tier available
- ✅ Easy setup
- ✅ Automatic deployments from GitHub
- ✅ Good documentation
- ✅ No credit card required for free tier

### Step 1: Sign Up for Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"** (recommended)
   - This connects your GitHub account
   - Makes deployment easier

### Step 2: Create a New Project

1. Once logged in, you'll see your dashboard
2. Click **"+ New Project"** button (top right or center)
3. You'll see options:
   - **"Deploy from GitHub repo"** ← Choose this
   - "Create Empty Project" (not needed)
   - "Deploy a Template" (not needed)

### Step 3: Connect Your GitHub Repository

1. Click **"Deploy from GitHub repo"**
2. You'll see a list of your GitHub repositories
3. Find: **`Sathyak31-tech/form-automation`**
4. Click on it
5. Railway will ask: **"Add to Project"** or **"Deploy Now"**
   - Click **"Deploy Now"**

### Step 4: Configure the Service

After clicking "Deploy Now", Railway will:
1. Create a new service
2. Start detecting your project
3. You'll see the service in your dashboard

**Now configure it:**

#### A. Set Root Directory

1. Click on your service (it might be named "form-automation" or similar)
2. Go to **"Settings"** tab (top of the page)
3. Scroll to **"Root Directory"**
4. Click **"Edit"** or the field
5. Change from: `./` (or blank)
6. Change to: `backend`
7. Click **"Save"** or **"Update"**

#### B. Set Start Command

1. Still in **Settings**
2. Find **"Start Command"** or **"Command"**
3. Click **"Edit"**
4. Set to: `python server.py`
5. Click **"Save"**

#### C. Set Python Version (Optional but Recommended)

1. In **Settings**, find **"Python Version"** or create a `runtime.txt`
2. You can add a `runtime.txt` file in your `backend/` folder:
   ```bash
   python-3.10.0
   ```
   Or set it in Railway settings if available

### Step 5: Set Environment Variables

1. In your service, go to **"Variables"** tab
2. Click **"+ New Variable"** or **"Add Variable"**
3. Add these variables (if needed):

   **Variable 1:**
   - Key: `ALLOWED_ORIGINS`
   - Value: `*` (allows all origins - you'll restrict later)
   - Click **"Add"**

   **Variable 2 (if needed):**
   - Key: `PORT`
   - Value: Railway sets this automatically, but if needed: `5000`
   - Click **"Add"**

### Step 6: Wait for Deployment

1. Railway will automatically:
   - Install dependencies from `backend/requirements.txt`
   - Run `python server.py`
   - Start your Flask server

2. Watch the **"Deployments"** tab or **"Logs"** tab
3. You'll see:
   - Installing dependencies...
   - Starting server...
   - Server running on port...

4. Wait 2-5 minutes for first deployment

### Step 7: Get Your Backend URL

1. Once deployment is complete, Railway will show a **"Public URL"**
2. Look for something like:
   ```
   https://your-project-name.up.railway.app
   ```
3. Click on it to open in a new tab
4. Add `/api/health` to test:
   ```
   https://your-project-name.up.railway.app/api/health
   ```
5. You should see: `{"status": "healthy"}`

### Step 8: Save Your Backend URL

**⚠️ IMPORTANT:** Save this URL! You'll need it for frontend deployment.

Example:
```
https://form-automation-backend.up.railway.app
```

### Step 9: Test Your Backend

Test these endpoints:

1. **Health Check:**
   ```bash
   curl https://your-backend.up.railway.app/api/health
   ```
   Should return: `{"status": "healthy"}`

2. **Test in Browser:**
   - Visit: `https://your-backend.up.railway.app/api/health`
   - Should see JSON response

### Step 10: Configure Domain (Optional)

If you want a custom domain:
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. Follow the instructions

---

## 🌐 Option 2: Deploy to Render (Alternative)

### Why Render?
- ✅ Free tier available
- ✅ Good for static sites and backends
- ✅ Easy setup

### Step 1: Sign Up

1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. Sign up with GitHub

### Step 2: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect account"** if prompted
4. Select your repository: `Sathyak31-tech/form-automation`

### Step 3: Configure Service

Fill in the form:

- **Name:** `form-automation-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python server.py`

### Step 4: Add Environment Variables

Click **"Advanced"** and add:
- `ALLOWED_ORIGINS` = `*`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Get your URL: `https://form-automation-backend.onrender.com`

---

## 🔧 Backend Configuration Checklist

Make sure your backend is ready:

### Files Required:
- ✅ `backend/server.py` (your Flask app)
- ✅ `backend/populator.py` (form processing)
- ✅ `backend/requirements.txt` (dependencies)

### Requirements.txt Should Include:
```
Flask==3.1.2
flask-cors==6.0.1
python-docx==1.2.0
```

### Server.py Should:
- ✅ Have CORS configured
- ✅ Listen on `0.0.0.0` (not `localhost`)
- ✅ Use `os.environ.get('PORT', 5000)` for port

Let me check if your server.py needs any updates:
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
read_file
