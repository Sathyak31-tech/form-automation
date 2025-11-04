# 📝 Signature Image Setup

## How to Add Your Signature Image

To use signature images in the auto-fill forms, follow these steps:

### Step 1: Prepare Your Signature Image

1. **Scan or create your signature image**
   - Format: PNG, JPG, or JPEG
   - Recommended: PNG with transparent background
   - Size: Less than 5MB
   - Clear, high-quality image works best

2. **Save the image**
   - Name it: `signature.png` (or `signature.jpg`)
   - Place it in the project root directory: `/Users/ushaswikurmala/form_automation/`

### Step 2: Update test_data.json

The `test_data.json` file already has the signature path configured:
```json
"signature_image_path": "signature.png"
```

If your file has a different name or location, update this path accordingly:
- `"signature_image_path": "signature.png"` (same directory)
- `"signature_image_path": "./signatures/my_signature.png"` (relative path)
- `"signature_image_path": "/full/path/to/signature.png"` (absolute path)

### Step 3: Run the Auto-Fill Script

```bash
python3 auto_fill_forms.py
```

The script will:
1. ✅ Load your signature image automatically
2. ✅ Convert it to base64 format
3. ✅ Include it in the form processing
4. ✅ Insert it into all signature fields in the forms

### What Happens

- **LOA Forms**: Signature appears only on the right side ("You"), not on the left ("ACCOLITE")
- **NDA Forms**: Signature appears only on the right side ("You"), not on the left ("ACCOLITE")  
- **Other Forms**: Signature appears in all signature fields

### Troubleshooting

**Problem: Signature not appearing**
- ✅ Check that `signature.png` exists in the project root
- ✅ Verify the path in `test_data.json` matches your file name
- ✅ Check file permissions (should be readable)
- ✅ Ensure the image format is PNG, JPG, or JPEG

**Problem: Script says "Signature image file not found"**
- ✅ Make sure the file is in the correct location
- ✅ Check the path in `test_data.json` is correct
- ✅ Use absolute path if relative path doesn't work

**Problem: Signature too large or unclear**
- ✅ Resize image to reasonable size (recommended: 500x200 pixels)
- ✅ Use a clear, high-contrast signature
- ✅ Ensure good lighting when scanning/photographing

### Example File Structure

```
form_automation/
├── signature.png          ← Your signature image here
├── test_data.json         ← Contains "signature_image_path": "signature.png"
├── auto_fill_forms.py     ← Automatically loads and processes signature
└── output/                ← Generated forms with signatures appear here
```

### Quick Test

1. Place `signature.png` in the project root
2. Run: `python3 auto_fill_forms.py`
3. Check the output: You should see "✅ Signature image loaded successfully"
4. Open generated forms in `output/` to verify signatures appear

---

**Note**: If you don't have a signature image, the forms will still be generated, but signature fields will be left empty. The script will show a warning but continue processing.

