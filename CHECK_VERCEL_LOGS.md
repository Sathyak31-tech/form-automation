# How to Check Vercel Function Logs

## Step-by-Step to Find the Error

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Find your project: `form-automation`

### 2. View Function Logs
1. Click on your project
2. Go to **"Deployments"** tab
3. Click on the **failed deployment** (the one with the error)
4. Scroll down to **"Function Logs"** or **"Runtime Logs"** section
5. Look for Python error messages

### 3. What to Look For
- Python traceback errors
- Import errors
- "Module not found" errors
- File not found errors
- Any red error messages

### 4. Share the Error
Copy the error message and share it with me so I can fix it!

## Quick Test

Also test the health endpoint:
```
https://form-automation-fto3vp272-form-automations-projects.vercel.app/api/health
```

If this also fails, Python functions aren't working on Vercel.

## Most Likely Issues

1. **Templates not found** - Templates directory missing
2. **Import error** - populator.py not found
3. **Python not supported** - Vercel might not support Python serverless functions
4. **Dependencies missing** - python-docx not installed

**Please check the function logs and share the actual Python error!**

