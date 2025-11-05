# Fixing Vercel Deployment Failures

## Problem
Recent commits show deployment failures (red X 0/1) in GitHub. Only one commit succeeded:
- ✅ "Fix dependencies and handler export" (2 hours ago)
- ❌ All other recent commits failed

## How to Check Deployment Logs

### Method 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project (`form-automation`)
3. Click on "Deployments" tab
4. Click on any failed deployment (red X)
5. Scroll down to see the build logs

### Method 2: GitHub Actions (if configured)
1. Go to your GitHub repo
2. Click on "Actions" tab
3. Look for failed workflows

## Common Issues and Fixes

### Issue 1: Python Runtime Format
**Problem**: `runtime.txt` might have wrong format
**Fix**: Changed from `python-3.9` to `python3.9`

### Issue 2: Missing Files in Deployment
**Problem**: `templates/` or `lib/populator.py` not in Git
**Check**:
```bash
git ls-files | grep -E "(templates|lib/populator)"
```

### Issue 3: Requirements Not Installing
**Problem**: `api/requirements.txt` dependencies failing
**Check**: Look for errors about `lxml` or `python-docx` in logs

### Issue 4: Function Not Detected
**Problem**: Vercel not recognizing Python functions
**Fix**: Ensure `api/` directory structure is correct:
```
api/
  ├── process-forms.py
  ├── health.py
  ├── download.py
  ├── requirements.txt
  └── runtime.txt
```

## Quick Diagnostic Steps

1. **Check if files are in Git**:
   ```bash
   git ls-files api/
   git ls-files templates/
   git ls-files lib/
   ```

2. **Verify runtime.txt format**:
   ```bash
   cat api/runtime.txt
   # Should show: python3.9
   ```

3. **Check Vercel build logs** for specific errors:
   - Import errors → `lib/populator.py` missing
   - Module not found → Dependencies not installing
   - File not found → `templates/` directory missing

## Next Steps

After fixing `runtime.txt`, commit and push:
```bash
git add api/runtime.txt
git commit -m "Fix Python runtime format for Vercel"
git push origin main
```

Then check the deployment status again. If it still fails, check the Vercel logs for the specific error message.

