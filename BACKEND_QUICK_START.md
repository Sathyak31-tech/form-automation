# Backend Deployment - Quick Start Guide

## 🎯 Where to Deploy?

**Railway** ← Recommended (easiest, free tier)

## 📝 5-Minute Setup on Railway

### Step 1: Go to Railway
👉 [railway.app](https://railway.app) → Sign up with GitHub

### Step 2: Create Project
1. Click **"+ New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select: `Sathyak31-tech/form-automation`
4. Click **"Deploy Now"**

### Step 3: Configure
Click on your service → **Settings** tab:

1. **Root Directory:** `backend`
2. **Start Command:** `python server.py`

### Step 4: Wait & Get URL
- Wait 2-5 minutes
- Railway gives you a URL like: `https://xxx.up.railway.app`
- Test: Visit `https://xxx.up.railway.app/api/health`
- Should see: `{"status": "healthy"}`

### Step 5: Save URL
**Save this URL!** You'll need it for frontend deployment.

---

## ✅ That's It!

Your backend is now live. Use the Railway URL for your frontend's `REACT_APP_API_URL`.

---

## 🆘 Need More Details?

See: `BACKEND_DEPLOYMENT_GUIDE.md` for full step-by-step instructions.

---

## 🔧 Optional: Environment Variables

In Railway → Settings → Variables, you can add:

```
ALLOWED_ORIGINS=*
```

(This allows all origins - you'll restrict to your Vercel URL later)

