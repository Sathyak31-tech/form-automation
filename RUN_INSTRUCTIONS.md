# 🚀 How to Run the Form Automation System

## Quick Start (Simplest Method)

### Step 1: Make Scripts Executable
```bash
cd /Users/ushaswikurmala/form_automation
chmod +x START_APP.sh STOP_APP.sh QUICK_TEST.sh
```

### Step 2: Start the Application
```bash
./START_APP.sh
```

Wait for the output:
```
App running!
   Frontend: http://localhost:3000
   Backend:  http://localhost:5000
```

### Step 3: Access the Web Interface
1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Form Automation interface

### Step 4: Fill Out Forms
1. Navigate through the form steps:
   - Personal Info (upload signature image here)
   - Address Info
   - Education
   - Employment
   - References
   - Gaps
   - EPF/Gratuity
   - Preview
   - Process

2. **Upload Signature Image**: 
   - In the "Personal Info" step, you'll see a "Signature Image" upload field
   - Click "Choose File" and select your signature image
   - You'll see a preview of your signature

3. Click "Process Forms" on the final step

4. Download the generated DOCX files

### Step 5: Stop the Application
```bash
./STOP_APP.sh
```

---

## Alternative: Manual Start (If Scripts Don't Work)

### Terminal 1 - Backend Server
```bash
cd /Users/ushaswikurmala/form_automation/backend
source venv/bin/activate
python server.py
```

You should see:
```
🚀 Starting Form Automation Backend Server...
🌐 Server running on http://localhost:5000
```

### Terminal 2 - Frontend Server
```bash
cd /Users/ushaswikurmala/form_automation/frontend
npm start
```

You should see:
```
Compiled successfully!
You can now view the app in the browser.
  Local: http://localhost:3000
```

---

## Testing the System

### Quick Test
```bash
cd /Users/ushaswikurmala/form_automation
./QUICK_TEST.sh
```

This will verify:
- ✅ Backend is running
- ✅ Frontend is accessible
- ✅ Forms can be processed

### Manual Test (Command Line)
```bash
cd /Users/ushaswikurmala/form_automation
python3 auto_fill_forms.py
```

Check generated files:
```bash
ls -la output/*.docx
```

---

## Troubleshooting

### Problem: Port Already in Use

**Solution:**
```bash
# Stop all processes
./STOP_APP.sh

# Or manually kill processes
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Wait a few seconds
sleep 3

# Restart
./START_APP.sh
```

### Problem: Backend Not Starting

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

### Problem: Frontend Not Starting

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: Forms Not Generating

**Check Backend Health:**
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"healthy"}`

**Check Logs:**
```bash
tail -f backend.log
tail -f frontend.log
```

---

## Verification Checklist

Before using the system, verify:

- [ ] Backend is running (http://localhost:5000/api/health returns healthy)
- [ ] Frontend is accessible (http://localhost:3000 loads)
- [ ] Signature upload field appears in Personal Info step
- [ ] Forms can be processed without errors
- [ ] DOCX files are generated in `output/` directory

---

## Using the Signature Feature

### How to Upload Signature:

1. **Prepare Your Signature Image**
   - Scan or take a photo of your signature
   - Save as: PNG, JPG, or JPEG format
   - Recommended size: less than 5MB
   - Clear background works best

2. **Upload in the App**
   - Go to Step 1: "Personal Info"
   - Scroll down to "Signature Image" field
   - Click "Choose File"
   - Select your signature image
   - You'll see a preview

3. **Signature Will Be Inserted**
   - The signature will automatically appear in:
     - LOA forms (right side only)
     - NDA forms (right side only)
     - All other forms that require signatures

### Important Notes:
- ✅ Signature appears only on the right side ("You") in LOA/NDA forms
- ✅ Signature appears in all signature fields in other forms
- ✅ Signature size is automatically adjusted to 2 inches wide

---

## File Locations

- **Generated Forms**: `output/` directory
- **Form Templates**: `templates/` directory
- **Backend Logs**: `backend.log`
- **Frontend Logs**: `frontend.log`
- **Test Data**: `test_data.json`

---

## Quick Reference Commands

```bash
# Start application
./START_APP.sh

# Stop application
./STOP_APP.sh

# Run tests
./QUICK_TEST.sh

# Check if services are running
curl http://localhost:5000/api/health
curl http://localhost:3000

# View logs
tail -f backend.log
tail -f frontend.log

# Clear output directory
rm -f output/*.docx
```

---

## Need Help?

1. Check logs: `tail -f backend.log frontend.log`
2. Run test: `./QUICK_TEST.sh`
3. Verify ports: `lsof -i:5000` and `lsof -i:3000`
4. Check dependencies: `pip list` and `npm list`

---

**Ready to go!** 🎉

Simply run `./START_APP.sh` and open http://localhost:3000 in your browser.

