# Quick Setup - Connect Frontend to Backend

## ✅ Backend Status: WORKING!

Your Railway backend is running at: `https://web-production-f43ab.up.railway.app`

---

## Step 1: Configure Frontend on Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add this variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://web-production-f43ab.up.railway.app`
   - **Environment**: Select **all** (Production, Preview, Development)
4. Click **"Save"**

## Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (2-3 minutes)

## Step 3: Configure CORS in Railway

1. Go to **Railway Dashboard** → Your Service → **Variables** tab
2. Click **"New Variable"**
3. Add:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: `https://your-frontend.vercel.app` (your Vercel URL)
   - Or use `*` for testing (less secure but works for testing)
4. Railway will automatically restart

## Step 4: Test Everything

### Test Backend:
- ✅ Root: `https://web-production-f43ab.up.railway.app/` (already working!)
- Health: `https://web-production-f43ab.up.railway.app/api/health`

### Test Frontend:
1. Visit your Vercel frontend URL
2. Fill in the form
3. Click "Process Forms"
4. Should connect to Railway backend and generate forms!

---

## Troubleshooting

If frontend can't connect:
- Make sure `REACT_APP_API_URL` is set correctly
- Make sure you **redeployed** after adding the variable
- Check browser console for errors

If CORS errors:
- Add your Vercel URL to `ALLOWED_ORIGINS` in Railway
- Or temporarily use `ALLOWED_ORIGINS=*` for testing

