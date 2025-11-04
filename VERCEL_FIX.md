# Fix for Vercel "Could not find index.html" Error

## Problem
Vercel couldn't find `index.html` during the build process.

## Solution

The issue is with the `vercel.json` configuration. Since you set **Root Directory** to `frontend/` in the Vercel dashboard, Vercel is already working from the `frontend/` directory, so the build commands shouldn't include `cd frontend`.

## What Was Changed

Updated `vercel.json`:
- **Before:** `buildCommand: "cd frontend && npm install && npm run build"`
- **After:** `buildCommand: "npm run build"`

- **Before:** `outputDirectory: "frontend/build"`
- **After:** `outputDirectory: "build"`

## Vercel Dashboard Settings

Make sure in your Vercel project settings:
- ✅ **Root Directory:** `frontend`
- ✅ **Build Command:** Leave blank (Vercel will use `vercel.json` or auto-detect)
- ✅ **Output Directory:** Leave blank (Vercel will use `vercel.json` or auto-detect)

## Next Steps

1. **Commit and push the updated `vercel.json`:**
   ```bash
   git add vercel.json
   git commit -m "Fix vercel.json for correct build path"
   git push
   ```

2. **Redeploy in Vercel:**
   - Go to your Vercel project
   - Click "Redeploy" or push a new commit
   - The build should now work correctly

## Alternative: If Root Directory is NOT Set

If you didn't set Root Directory to `frontend/` in Vercel dashboard, then use this `vercel.json` instead:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

But if Root Directory IS set to `frontend/`, use the updated version (which is what we just changed).

