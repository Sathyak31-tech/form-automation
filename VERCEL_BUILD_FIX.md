# Fix for "Could not find index.html" Error

## Problem
Vercel is looking for `index.html` in `/vercel/path0/frontend/public` but can't find it during build.

## Solution

The issue is with the Root Directory setting. Since we have both `api/` and `frontend/` in the root, we need to handle this differently.

### Option 1: Set Root Directory to `frontend` (Recommended)

**In Vercel Dashboard:**
1. Go to your project settings
2. Set **Root Directory** to: `frontend`
3. Update `vercel.json` accordingly (already done)

**Updated vercel.json:**
- Build Command: `npm install && npm run build` (no `cd frontend`)
- Output Directory: `build` (not `frontend/build`)

This works because:
- When Root Directory = `frontend`, Vercel starts from the frontend directory
- The build command runs directly (no need to `cd`)
- `api/` functions are still accessible from root

### Option 2: Keep Root Directory as `.` (Root)

If you want to keep Root Directory as `.` (root), then:
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/build`

But this might have path resolution issues.

## Current Fix Applied

Updated `vercel.json` to work with Root Directory = `frontend`:

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "build",
  "rewrites": [...]
}
```

## Next Steps

1. **Update Vercel Dashboard:**
   - Go to Settings → General
   - Set **Root Directory** to: `frontend`
   - Save

2. **Redeploy:**
   - Vercel will automatically redeploy
   - Or trigger a new deployment

3. **Verify:**
   - Build should complete successfully
   - Frontend should deploy
   - API functions should still work

## Why This Works

- **Root Directory = `frontend`**: Vercel treats `frontend/` as the project root
- **Build Command**: Runs from `frontend/` directory, so `npm run build` works directly
- **API Functions**: Vercel still detects `api/` directory in the repository root
- **Output**: `build/` directory is relative to `frontend/`

## Alternative: If Root Directory Must Stay as `.`

If you need Root Directory to be `.` (maybe for API detection), then:
- Keep build command as: `cd frontend && npm install && npm run build`
- But this might need additional path configuration

Try Option 1 first (Root Directory = `frontend`) - it's simpler and should work!

