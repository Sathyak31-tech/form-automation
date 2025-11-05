# Vercel Dashboard Settings - CRITICAL FIX

## The Problem

The error shows Vercel is running: `npm install && npm run build`
But it should run: `cd frontend && npm install && npm run build`

This means **Vercel Dashboard settings are overriding vercel.json**.

## Solution: Update Vercel Dashboard

### Step 1: Go to Project Settings

1. Go to your Vercel dashboard
2. Click on your project: `form-automation`
3. Go to **Settings** tab
4. Click **General** in the left sidebar

### Step 2: Update Build Settings

**IMPORTANT:** Make sure these match exactly:

1. **Root Directory:**
   - Set to: `.` (just a dot, or leave blank)
   - NOT `frontend`

2. **Build Command:**
   - Click **Edit** (pencil icon)
   - Delete what's there: `npm install && npm run build`
   - Enter: `cd frontend && npm install && npm run build`
   - Click **Save**

3. **Output Directory:**
   - Click **Edit**
   - Delete what's there: `build`
   - Enter: `frontend/build`
   - Click **Save**

4. **Install Command:**
   - Click **Edit**
   - Enter: `cd frontend && npm install`
   - Or leave as default (Vercel will auto-detect)

### Step 3: Verify vercel.json

Your `vercel.json` should have:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build"
}
```

### Step 4: Redeploy

1. After saving settings, Vercel should auto-redeploy
2. Or go to **Deployments** tab and click **Redeploy**

## Why This Happens

- Vercel Dashboard settings **override** `vercel.json` when manually set
- If you set Build Command in dashboard, it ignores vercel.json
- You need to update BOTH places, or clear dashboard settings to use vercel.json

## Quick Fix Checklist

- [ ] Root Directory = `.` (root)
- [ ] Build Command = `cd frontend && npm install && npm run build`
- [ ] Output Directory = `frontend/build`
- [ ] Save all changes
- [ ] Wait for redeploy

## Alternative: Clear Dashboard Settings

If you want to use only `vercel.json`:
1. Go to Settings → General
2. **Delete/Clear** the Build Command field (leave blank)
3. **Delete/Clear** the Output Directory field (leave blank)
4. Vercel will use `vercel.json` instead

**Try updating the dashboard settings first - that's the quickest fix!**

