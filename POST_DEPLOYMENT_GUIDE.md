# Post-Deployment Guide - Changes After Deploying

This guide covers what you need to do **AFTER** deploying both backend and frontend.

---

## 🎯 After Deployment Checklist

### Step 1: Get Your URLs

After deploying, save these URLs:

1. **Backend URL** (Railway):
   ```
   https://your-backend.up.railway.app
   ```

2. **Frontend URL** (Vercel):
   ```
   https://form-automation.vercel.app
   ```

---

## 🔧 Required Changes After Deployment

### 1. Update Backend CORS (IMPORTANT!)

Your backend needs to allow requests from your Vercel frontend.

#### On Railway:
1. Go to Railway dashboard
2. Click on your backend service
3. Go to **Settings** → **Variables**
4. Add/Update variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** Your Vercel URL(s), comma-separated:
     ```
     https://form-automation.vercel.app,https://form-automation-*.vercel.app
     ```
     (Replace with your actual Vercel URL)
5. Railway will automatically redeploy

#### On Render:
1. Go to Render dashboard
2. Click on your web service
3. Go to **Environment** tab
4. Add variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** Your Vercel URL
5. Save changes (auto-redeploys)

#### Why This Matters:
- Without this, your frontend will get CORS errors
- Browser will block API requests from Vercel to Railway
- Forms won't be able to submit

---

### 2. Verify Frontend Environment Variable

#### On Vercel:
1. Go to Vercel dashboard
2. Your project → **Settings** → **Environment Variables**
3. Verify `REACT_APP_API_URL` is set correctly:
   - Should be your Railway backend URL
   - Not `localhost:5000`
   - Example: `https://form-automation.up.railway.app`
4. If incorrect, update it and redeploy

---

### 3. Test the Connection

#### Test 1: Backend Health
```bash
curl https://your-backend.up.railway.app/api/health
```
Should return: `{"status": "healthy"}`

#### Test 2: Frontend Loads
- Visit your Vercel URL
- Should see your React app
- No errors in browser console (F12)

#### Test 3: Form Submission
1. Fill out a form in your Vercel app
2. Click "Process Forms"
3. Check browser console (F12) for errors:
   - ✅ Should see successful API call
   - ❌ If you see CORS error → Backend CORS not configured
   - ❌ If you see 404 → Backend URL incorrect in frontend

---

## 🔍 Common Post-Deployment Issues

### Issue 1: CORS Error

**Error in browser console:**
```
Access to fetch at 'https://backend-url.com/api/...' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

**Solution:**
- Add your Vercel URL to backend `ALLOWED_ORIGINS` variable
- Redeploy backend

---

### Issue 2: API Calls Fail (404)

**Error in browser console:**
```
Failed to fetch
POST https://wrong-url.com/api/process-forms 404
```

**Solution:**
- Check `REACT_APP_API_URL` in Vercel settings
- Update with correct backend URL
- Redeploy frontend

---

### Issue 3: Backend Not Responding

**Error:**
- Backend health check fails
- API calls timeout

**Solution:**
1. Check Railway/Render logs
2. Verify backend is running
3. Check Railway service status (should be "Running")
4. Verify `server.py` is the start command

---

## 📝 Optional Improvements

### 1. Restrict CORS (Security)

After confirming everything works, restrict CORS to only your Vercel domain:

**Railway/Render Environment Variable:**
```
ALLOWED_ORIGINS=https://form-automation.vercel.app,https://www.yourdomain.com
```

Remove `*` and list only your actual domains.

---

### 2. Set Up Custom Domain (Optional)

#### For Vercel:
1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Railway:
1. Go to Railway service → **Settings** → **Networking**
2. Add custom domain
3. Configure DNS records

---

### 3. Enable Environment-Specific Variables

Set different backend URLs for different environments:

**Vercel Environment Variables:**
- **Production:** `REACT_APP_API_URL` = `https://backend-prod.railway.app`
- **Preview:** `REACT_APP_API_URL` = `https://backend-preview.railway.app`
- **Development:** `REACT_APP_API_URL` = `http://localhost:5000`

---

## ✅ Final Verification Checklist

After all changes, verify:

- [ ] Backend is accessible at Railway URL
- [ ] Backend health check works: `/api/health`
- [ ] Frontend loads on Vercel URL
- [ ] No console errors in browser
- [ ] CORS is configured correctly
- [ ] `REACT_APP_API_URL` is set in Vercel
- [ ] Form submission works end-to-end
- [ ] Files can be downloaded

---

## 🚨 Important Reminders

### After Every Code Change:
1. **Push to GitHub** → Both platforms auto-deploy
2. **Check deployment logs** for errors
3. **Test functionality** after deployment

### Environment Variables:
- **Never commit** `.env` files to GitHub
- Set variables in platform dashboards
- Use different values for dev/prod if needed

### Monitoring:
- Check Railway logs for backend issues
- Check Vercel build logs for frontend issues
- Monitor browser console for runtime errors

---

## 📞 Quick Troubleshooting

| Problem | Check This |
|---------|-----------|
| CORS error | Backend `ALLOWED_ORIGINS` variable |
| 404 on API calls | Frontend `REACT_APP_API_URL` variable |
| Build fails | Check Vercel build logs |
| Backend down | Check Railway service status |
| Forms not processing | Check backend logs, verify templates exist |

---

## 🎉 You're Done!

Once you've:
1. ✅ Updated backend CORS
2. ✅ Verified frontend environment variable
3. ✅ Tested form submission
4. ✅ Verified file downloads

Your deployment is complete and ready to use!

---

## 📚 Next Steps (Optional)

- Set up monitoring/analytics
- Configure custom domains
- Set up CI/CD notifications
- Add error tracking (Sentry, etc.)
- Set up database if needed
- Configure backup strategies

---

**Good luck with your deployment! 🚀**

If you encounter any issues, refer to the troubleshooting section or check the deployment logs.

