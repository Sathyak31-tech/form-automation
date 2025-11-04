# Vercel Deployment Guide

This guide will help you deploy the Form Automation frontend to Vercel.

## Important Notes

 **The backend (Flask server) cannot run on Vercel directly.** You need to deploy the backend separately on a platform that supports Python/Flask applications, such as:
- **Railway** (recommended - easy setup)
- **Render** (free tier available)
- **Heroku** (paid)
- **PythonAnywhere**
- **AWS/GCP/Azure**

## Step 1: Deploy Backend First

Before deploying the frontend, you need to deploy your backend and get its URL.

### Option A: Deploy to Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Create a new project
3. Add a new service → Deploy from GitHub repo
4. Select your repository
5. Railway will auto-detect it's Python
6. Set the root directory to `backend/`
7. Add environment variables if needed
8. Railway will provide you a URL like: `https://your-app.railway.app`

### Option B: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python server.py`
   - **Root Directory**: `backend`
5. Render will provide you a URL

## Step 2: Deploy Frontend to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.railway.app`)
6. Click "Deploy"

### Method 2: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to project root:
   ```bash
   cd /Users/ushaswikurmala/form_automation
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Set environment variable:
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter your backend URL when prompted
   ```

6. Redeploy with environment variable:
   ```bash
   vercel --prod
   ```

## Step 3: Update Vercel Configuration

The `vercel.json` file is already configured. Make sure it's in the root directory.

## Step 4: Environment Variables

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add:
   - **REACT_APP_API_URL**: Your backend URL (e.g., `https://your-backend.railway.app`)

**Important**: 
- For local development, create a `.env` file in the `frontend/` directory with:
  ```
  REACT_APP_API_URL=http://localhost:5000
  ```
- Don't commit `.env` files to git (they're in `.gitignore`)

## Step 5: Update CORS Settings

Make sure your backend allows requests from your Vercel domain. Update `backend/server.py`:

```python
from flask_cors import CORS

# Allow specific origins
CORS(app, origins=[
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app",
    "https://your-custom-domain.com"
])
```

Or allow all origins (for development):
```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

## Troubleshooting

### 404 Error
- Make sure `vercel.json` is in the root directory
- Check that the build command is correct
- Verify the output directory is `frontend/build`

### API Calls Not Working
- Check that `REACT_APP_API_URL` environment variable is set correctly
- Verify CORS is configured on the backend
- Check browser console for errors

### Build Fails
- Make sure all dependencies are in `frontend/package.json`
- Check that Node.js version is compatible (Vercel uses Node 18+ by default)

## Next Steps

After deployment:
1. Test the frontend on Vercel
2. Test API calls to your backend
3. Set up a custom domain (optional)
4. Configure environment variables for production

## File Structure

```
form_automation/
├── vercel.json          # Vercel configuration
├── frontend/
│   ├── .env.example     # Example environment variables
│   ├── package.json
│   └── src/
└── backend/             # Deploy separately
    ├── server.py
    └── requirements.txt
```

