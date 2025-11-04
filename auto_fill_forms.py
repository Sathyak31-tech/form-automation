#!/usr/bin/env python3
"""
Auto-fill forms using test data
This script reads test_data.json and sends it to the backend API
to automatically generate filled forms without manual input.
"""

import json
import os
import sys
import requests
import time
import base64

def main():
    # Configuration
    BACKEND_URL = "http://localhost:5000"
    TEST_DATA_FILE = "test_data.json"
    
    print(" Starting Auto-Fill Forms Script...")
    print("=" * 60)
    
    # Check if test data file exists
    if not os.path.exists(TEST_DATA_FILE):
        print(f" Error: {TEST_DATA_FILE} not found!")
        print(f"   Current directory: {os.getcwd()}")
        sys.exit(1)
    
    # Read test data
    print(f"📖 Reading test data from {TEST_DATA_FILE}...")
    try:
        with open(TEST_DATA_FILE, 'r') as f:
            test_data = json.load(f)
        print(f"✅ Test data loaded successfully")
        print(f"   Name: {test_data.get('name', 'N/A')}")
        print(f"   Email: {test_data.get('email', 'N/A')}")
        
        # Handle signature image if path is provided
        signature_path = test_data.get('signature_image_path')
        if signature_path:
            # Check if signature file exists
            if os.path.exists(signature_path):
                print(f"📷 Loading signature image from {signature_path}...")
                try:
                    # Read image file and convert to base64
                    with open(signature_path, 'rb') as img_file:
                        img_data = img_file.read()
                        img_base64 = base64.b64encode(img_data).decode('utf-8')
                        
                        # Determine MIME type based on file extension
                        ext = os.path.splitext(signature_path)[1].lower()
                        mime_types = {
                            '.png': 'image/png',
                            '.jpg': 'image/jpeg',
                            '.jpeg': 'image/jpeg',
                            '.gif': 'image/gif'
                        }
                        mime_type = mime_types.get(ext, 'image/png')
                        
                        # Add data URL prefix
                        test_data['signature_image'] = f'data:{mime_type};base64,{img_base64}'
                        print(f"✅ Signature image loaded successfully")
                    # Remove the path field as we now have the base64 data
                    test_data.pop('signature_image_path', None)
                except Exception as e:
                    print(f"⚠️  Warning: Could not load signature image: {str(e)}")
                    print(f"   Continuing without signature...")
            else:
                print(f"⚠️  Warning: Signature image file not found: {signature_path}")
                print(f"   Continuing without signature...")
                test_data.pop('signature_image_path', None)
    except Exception as e:
        print(f" Error reading test data: {str(e)}")
        sys.exit(1)
    
    # Check if backend is running
    print(f"\n🔍 Checking backend server at {BACKEND_URL}...")
    try:
        health_response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if health_response.status_code == 200:
            print(" Backend server is running")
        else:
            print("  Backend responded but health check failed")
    except requests.exceptions.ConnectionError:
        print(" Error: Backend server is not running!")
        print("   Please start the backend with: ./START_APP.sh")
        sys.exit(1)
    except Exception as e:
        print(f" Error connecting to backend: {str(e)}")
        sys.exit(1)
    
    # Send data to backend API
    print(f"\n Sending form data to backend API...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/process-forms",
            json=test_data,
            timeout=60  # 60 seconds timeout for processing
        )
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success'):
                print("\n" + "=" * 60)
                print("✅ SUCCESS! Forms processed successfully!")
                print("=" * 60)
                
                download_links = result.get('downloadLinks', [])
                
                if download_links:
                    print(f"\n📄 Generated {len(download_links)} files:")
                    print("-" * 60)
                    
                    print(f"\n📝 DOCX Files ({len(download_links)}):")
                    for link in download_links:
                        print(f"   ✓ {link['filename']}")
                    
                    print("\n📁 Files saved to: ./output/")
                    print(f"\n🌐 Download via browser:")
                    print(f"   {BACKEND_URL}/api/download/[filename]")
                else:
                    print("⚠️  No files were generated")
                
                print("\n" + "=" * 60)
                
            else:
                print(f" Backend reported failure: {result.get('error', 'Unknown error')}")
                sys.exit(1)
        else:
            print(f" Error: Backend returned status code {response.status_code}")
            print(f"   Response: {response.text}")
            sys.exit(1)
            
    except requests.exceptions.Timeout:
        print(" Error: Request timed out (processing took too long)")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f" Error sending request: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f" Unexpected error: {str(e)}")
        sys.exit(1)
    
    print("\n✨ All done! Your forms are ready.")

if __name__ == "__main__":
    main()
