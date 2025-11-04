#!/usr/bin/env python3
"""
Test script to verify signature image is being loaded correctly
"""
import json
import os
import base64

def test_signature_loading():
    print("🧪 Testing Signature Image Loading")
    print("=" * 60)
    
    # Check test_data.json
    if os.path.exists("test_data.json"):
        with open("test_data.json", 'r') as f:
            data = json.load(f)
        
        signature_path = data.get("signature_image_path")
        if signature_path:
            print(f"✅ Found signature_image_path in test_data.json: {signature_path}")
            
            if os.path.exists(signature_path):
                print(f"✅ Signature file exists at: {os.path.abspath(signature_path)}")
                file_size = os.path.getsize(signature_path)
                print(f"   File size: {file_size} bytes")
                
                # Try to read it
                try:
                    with open(signature_path, 'rb') as f:
                        img_data = f.read()
                        img_base64 = base64.b64encode(img_data).decode('utf-8')
                        print(f"✅ Successfully read and encoded signature image")
                        print(f"   Base64 length: {len(img_base64)} characters")
                        print(f"   Data URL: data:image/png;base64,{img_base64[:50]}...")
                except Exception as e:
                    print(f"❌ Error reading signature file: {e}")
            else:
                print(f"❌ Signature file does NOT exist at: {os.path.abspath(signature_path)}")
                print(f"   Current directory: {os.getcwd()}")
                print(f"   Please check if the file exists at this path")
        else:
            print(f"❌ No signature_image_path found in test_data.json")
            print(f"   Add: \"signature_image_path\": \"signature.png\" to test_data.json")
    else:
        print(f"❌ test_data.json not found")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_signature_loading()

