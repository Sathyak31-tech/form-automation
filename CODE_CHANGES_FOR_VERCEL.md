# Code Changes Required for Vercel Deployment

This document lists all the code changes you need to make for Vercel deployment.

## ✅ Already Completed Changes

The following changes have already been made:

1. **Frontend: `frontend/src/components/ProcessForms.js`**
   - ✅ Updated to use `REACT_APP_API_URL` environment variable
   - ✅ No longer hardcoded to `localhost:5000`

2. **Vercel Configuration: `vercel.json`**
   - ✅ Created with proper build and output directory settings

3. **Environment Variables: `frontend/.env.example`**
   - ✅ Created example file showing required environment variables

## 📝 Additional Changes Needed

### 1. Backend CORS Configuration (Optional but Recommended)

**File:** `backend/server.py`

The backend CORS has been updated to support environment variables. You can optionally configure it:

```python
# Current: Allows all origins (good for development)
CORS(app)

# Production option: Set ALLOWED_ORIGINS environment variable
# Example: ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com
```

**Action:** No changes needed in code, but when deploying backend:
- Set `ALLOWED_ORIGINS` environment variable on your backend hosting platform
- Include your Vercel app URL in the list

### 2. Remove Proxy from package.json (Optional)

**File:** `frontend/package.json`

The `proxy` field is only used in development. It doesn't affect production builds, but you can remove it if you want:

```json
// Remove this line (line 43):
"proxy": "http://localhost:5000"
```

**Note:** This is optional - it won't affect Vercel deployment since Vercel doesn't use the proxy field.

### 3. Create .env File for Local Development (Required)

**File:** `frontend/.env` (create this file, don't commit it)

Create a `.env` file in the `frontend/` directory for local development:

```env
REACT_APP_API_URL=http://localhost:5000
```

**Action:** Create this file manually (it's in `.gitignore` so it won't be committed)

## 🚀 Vercel Deployment Steps

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.railway.app`)
   - **Environment:** Production, Preview, Development (check all)

### Step 2: Configure Build Settings in Vercel

In Vercel project settings:
- **Root Directory:** `frontend` (if deploying from root) OR leave blank if `vercel.json` is configured
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)

### Step 3: Deploy Backend Separately

The backend needs to be deployed on a platform that supports Python/Flask:
- **Railway** (recommended)
- **Render**
- **Heroku**
- **PythonAnywhere**

See `VERCEL_DEPLOYMENT.md` for detailed backend deployment instructions.

## 📋 Summary Checklist

- [x] Frontend updated to use environment variables
- [x] `vercel.json` created
- [x] `.env.example` created
- [x] Backend CORS updated (supports environment variables)
- [ ] Create `frontend/.env` for local development
- [ ] Set `REACT_APP_API_URL` in Vercel dashboard
- [ ] Deploy backend separately
- [ ] Update backend CORS with Vercel URL (if restricting origins)

## 🔍 Testing

After deployment:

1. **Test Frontend:**
   - Visit your Vercel URL
   - Check browser console for errors
   - Verify API calls work

2. **Test Backend:**
   - Verify backend is accessible
   - Test CORS headers
   - Check API endpoints

3. **Test Integration:**
   - Fill out a form in the frontend
   - Submit and verify it reaches the backend
   - Check that files are generated

## 🐛 Troubleshooting

### Issue: 404 Error on Vercel
**Solution:** Make sure `vercel.json` is in the root directory and Root Directory is set correctly

### Issue: API Calls Fail
**Solution:** 
- Check `REACT_APP_API_URL` is set in Vercel
- Verify backend CORS allows your Vercel domain
- Check browser console for CORS errors

### Issue: Build Fails
**Solution:**
- Check Node.js version (Vercel uses 18+ by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## 📝 Notes

- The `proxy` field in `package.json` only works in development mode (`npm start`)
- In production, React apps need absolute URLs or environment variables
- Vercel automatically rebuilds when you push to your repository
- Environment variables need to be set in Vercel dashboard, not in code

