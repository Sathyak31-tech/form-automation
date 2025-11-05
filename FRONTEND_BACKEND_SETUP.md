# Frontend + Backend Deployment - Complete Setup

## ✅ Current Status

- **Backend**: Deployed on Railway ✅
- **Frontend**: Needs to be deployed on Vercel
- **Connection**: Frontend needs to know the Railway backend URL

---

## Step 1: Get Your Railway Backend URL

1. Go to Railway Dashboard
2. Click on your service
3. Go to "Settings" tab
4. Find "Public Domain" or "Generate Domain"
5. Copy the URL (e.g., `https://your-app.railway.app`)
6. Test it: Visit `https://your-app.railway.app/api/health`
   - Should return: `{"status": "healthy"}`

---

## Step 2: Deploy Frontend on Vercel

### Option A: If Already Connected (Auto-Deploy)
1. Go to https://vercel.com/dashboard
2. Your project should already be connected
3. It will auto-deploy when you push to GitHub
4. Or manually trigger: Deployments → "..." → Redeploy

### Option B: New Deployment
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Click "Deploy"

---

## Step 3: Configure Frontend to Use Backend

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-app.railway.app`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click "Save"
5. **IMPORTANT**: Redeploy your frontend
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Step 4: Configure CORS in Backend

After frontend is deployed, update Railway:

1. Go to Railway Dashboard → Your Service → Variables tab
2. Add environment variable:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - Or use `*` for testing (not recommended for production)
3. Railway will automatically restart

---

## Step 5: Test Everything

### Test Backend:
- Visit: `https://your-backend.railway.app/api/health`
- Should return: `{"status": "healthy"}`

### Test Frontend:
- Visit: `https://your-frontend.vercel.app`
- Should load the form
- Fill in some data
- Click "Process Forms"
- Should connect to backend and generate forms

---

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` is set correctly in Vercel
- Make sure you redeployed after adding the variable
- Check browser console for errors

### CORS errors
- Add your frontend URL to `ALLOWED_ORIGINS` in Railway
- Or temporarily set `ALLOWED_ORIGINS=*` for testing

### 404 errors
- Make sure backend URL doesn't have trailing slash
- Check Railway logs to see if server is running
- Test `/api/health` endpoint directly

---

## Quick Checklist

- [ ] Backend deployed on Railway
- [ ] Backend URL obtained
- [ ] Backend `/api/health` works
- [ ] Frontend deployed on Vercel
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] Frontend redeployed
- [ ] `ALLOWED_ORIGINS` set in Railway
- [ ] Test form submission works

---

Let me know your Railway backend URL and I'll help you configure everything!

