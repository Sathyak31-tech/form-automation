# Vercel Python Function Crash - Complete Fix Guide

## Problem
All Python serverless functions return `FUNCTION_INVOCATION_FAILED` - the function crashes before execution.

## Root Causes

### 1. Python Dependencies Not Installing
Vercel might not be installing dependencies from `api/requirements.txt`.

**Fix:**
- Ensure `api/requirements.txt` exists and has all dependencies
- Check Vercel build logs to see if pip install runs
- Dependencies should be: `python-docx==0.8.11`, `lxml==4.9.3`, `lxml-html-clean==0.1.0`

### 2. Handler Function Format
Vercel Python functions need specific handler format.

**Current format (CORRECT):**
```python
def handler(req):
    return {
        'statusCode': 200,
        'headers': {...},
        'body': json.dumps({...})
    }
```

### 3. Module-Level Code Crashing
If code runs at module level (outside handler), it can crash before handler runs.

**Fix:** Move all code inside handler function.

### 4. Import Errors
If `populator.py` or dependencies can't be imported, function crashes.

**Fix:** Use lazy imports (already implemented).

## Step-by-Step Solution

### Step 1: Test Simple Endpoint
After redeploy, test: `https://your-app.vercel.app/api/simple`

If this works → Python runtime is OK, problem is in process-forms.py
If this fails → Python runtime not configured

### Step 2: Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click your project
3. Click "Functions" tab
4. Click on `/api/simple` or `/api/process-forms`
5. Check "Logs" tab
6. Look for Python errors

### Step 3: Verify Python Runtime
In Vercel Dashboard → Settings → Functions:
- Check if Python runtime is enabled
- Verify Python version (should be 3.9)

### Step 4: Check Build Logs
In Vercel Dashboard → Deployments → Latest deployment:
- Look for "Installing dependencies" step
- Check if `pip install -r api/requirements.txt` runs
- Look for any errors

## Alternative: Use Node.js Runtime

If Python continues to fail, we can:
1. Convert Python code to Node.js
2. Use child_process to run Python script
3. Or deploy backend separately (Railway, Render)

## Testing Checklist

After each fix, test these endpoints:
- [ ] `/api/simple` - Should return `{"status":"ok"}`
- [ ] `/api/health` - Should return `{"status":"healthy"}`
- [ ] `/api/test-import` - Shows what imports work
- [ ] `/api/process-forms` - Main function

## Current Status

✅ Code syntax is correct
✅ Handler format is correct  
✅ Error handling is comprehensive
❌ Function still crashing (likely dependency issue)

## Next Steps

1. Wait for Vercel to redeploy (2-3 minutes)
2. Test `/api/simple` endpoint
3. Check Vercel function logs for specific error
4. Share the error message from logs
