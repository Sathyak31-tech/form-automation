# Vercel Full-Stack Deployment Guide

This guide covers deploying both frontend and backend on Vercel using serverless functions.

## 📁 Project Structure

```
form_automation/
├── frontend/          # React app
├── api/               # Vercel serverless functions (Python)
│   ├── process-forms.py
│   ├── health.py
│   ├── download.py
│   └── requirements.txt
├── lib/               # Shared Python code
│   └── populator.py
├── templates/         # DOCX templates (packaged with deployment)
├── vercel.json        # Vercel configuration
└── README.md
```

## ✅ What's Been Converted

### Backend → Serverless Functions
- ✅ `/api/process-forms` → `api/process-forms.py`
- ✅ `/api/health` → `api/health.py`
- ✅ `/api/download` → `api/download.py` (files returned as base64)

### Key Changes
- ✅ Removed Flask dependency
- ✅ Direct function calls instead of subprocess
- ✅ Files returned as base64 in response
- ✅ Templates packaged with deployment
- ✅ Frontend updated to handle base64 files

## 🚀 Deployment Steps

### Step 1: Verify Files Are Ready

Check these files exist:
- ✅ `api/process-forms.py`
- ✅ `api/health.py`
- ✅ `api/download.py`
- ✅ `api/requirements.txt`
- ✅ `lib/populator.py`
- ✅ `templates/` directory with all DOCX files
- ✅ `vercel.json` with Python runtime config

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Convert to Vercel serverless functions"
git push origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `.` (root, not `frontend`)
   - **Framework Preset:** Leave as "Other"
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/build`

4. **Environment Variables:**
   - Remove `REACT_APP_API_URL` (not needed - using relative paths)

5. Click **"Deploy"**

### Step 4: Verify Deployment

1. **Test Health Check:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status": "healthy"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Should see your React app

3. **Test Form Processing:**
   - Fill out a form
   - Submit
   - Should process and return files

## 🔧 Configuration Details

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### API Requirements

File: `api/requirements.txt`
```
python-docx==0.8.11
lxml==4.9.3
```

## 📝 How It Works

### Request Flow

1. **Frontend** → Submits form to `/api/process-forms`
2. **Serverless Function** → Processes form using `populator.py`
3. **Response** → Returns files as base64 encoded strings
4. **Frontend** → Converts base64 to blob and downloads

### File Handling

- Files are **not stored** on Vercel (serverless functions are stateless)
- Files are returned **directly in the API response** as base64
- Frontend handles conversion and download
- No separate download endpoint needed

## ⚠️ Important Notes

### Limitations

1. **File Size Limits:**
   - Vercel has response size limits (~4.5MB for free tier)
   - If files are too large, consider using Vercel Blob Storage

2. **Execution Time:**
   - Free tier: 10 seconds
   - Pro tier: 60 seconds
   - Complex forms might hit limits

3. **Templates:**
   - Must be included in deployment
   - Stored in `templates/` directory
   - Automatically packaged by Vercel

### Troubleshooting

**Issue: Python runtime not found**
- Check `vercel.json` has `functions` configuration
- Verify Python version (3.9)

**Issue: Templates not found**
- Ensure `templates/` directory is in root
- Check all DOCX files are committed to git

**Issue: Files too large**
- Response size limit exceeded
- Consider using Vercel Blob Storage or external storage

**Issue: Function timeout**
- Form processing takes too long
- Consider optimizing populator or using Pro tier

## 🔄 Migration from Separate Deployment

If you were using Railway + Vercel:

1. **Remove** `REACT_APP_API_URL` environment variable
2. **Update** frontend to use relative paths (`/api/...`)
3. **Deploy** everything to Vercel
4. **Test** all functionality

## 📊 Comparison

| Feature | Separate (Railway+Vercel) | Vercel Only |
|---------|---------------------------|-------------|
| Setup | Two platforms | One platform |
| Files | Persistent storage | Returned directly |
| Time Limits | None | 10s free, 60s pro |
| Cost | Free tier on both | Free tier |
| Complexity | Medium | Medium (refactored) |

## ✅ Deployment Checklist

- [ ] All files committed to git
- [ ] `api/` directory has all functions
- [ ] `lib/populator.py` exists
- [ ] `templates/` directory included
- [ ] `vercel.json` configured
- [ ] Frontend updated for base64 files
- [ ] Deployed on Vercel
- [ ] Health check works
- [ ] Form processing works
- [ ] File downloads work

## 🎉 You're Done!

Your full-stack app is now on Vercel! Everything is in one place.

---

**Need help?** Check the troubleshooting section or Vercel logs.

