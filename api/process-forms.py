"""
Vercel serverless function for processing forms
"""
import os
import json
import base64
import tempfile
import shutil
import sys
from pathlib import Path

# Don't import at module level - import lazily in handler
# This prevents crashes if dependencies aren't available yet
SmartFormPopulator = None
_import_error = None

def handler(req):
    """Process form data and generate filled documents - Vercel serverless function"""
    # Handle CORS preflight
    if req.get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    # Diagnostic logging
    try:
        print(f"Python version: {sys.version}")
        print(f"Python path: {sys.path}")
        print(f"Current directory: {os.getcwd()}")
        print(f"API file location: {__file__}")
    except Exception as diag_err:
        print(f"Diagnostic error: {diag_err}")
    
    # Lazy import of populator - only when handler is called
    global SmartFormPopulator, _import_error
    if SmartFormPopulator is None:
        try:
            # Import populator - try multiple paths
            lib_path = os.path.join(os.path.dirname(__file__), '..', 'lib')
            sys.path.insert(0, lib_path)
            
            # Also try absolute path
            api_dir = Path(__file__).parent
            root_dir = api_dir.parent
            lib_abs_path = str(root_dir / 'lib')
            if lib_abs_path not in sys.path:
                sys.path.insert(0, lib_abs_path)
            
            print(f"Attempting to import populator from: {lib_path}")
            print(f"Lib path exists: {os.path.exists(lib_path)}")
            print(f"Lib populator exists: {os.path.exists(os.path.join(lib_path, 'populator.py'))}")
            
            from populator import SmartFormPopulator
            print("✅ Successfully imported SmartFormPopulator")
            _import_error = None
        except ImportError as import_err:
            _import_error = import_err
            error_msg = f'Failed to import SmartFormPopulator: {str(import_err)}'
            print(f"❌ {error_msg}")
            print(f"Available files in lib: {os.listdir(lib_path) if os.path.exists(lib_path) else 'Path does not exist'}")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': False,
                    'error': error_msg,
                    'type': 'ImportError',
                    'lib_path': lib_path,
                    'lib_exists': os.path.exists(lib_path) if 'lib_path' in locals() else False,
                    'details': str(import_err)
                })
            }
        except Exception as import_err:
            _import_error = import_err
            error_msg = f'Failed to import SmartFormPopulator: {str(import_err)}'
            print(f"❌ {error_msg}")
            import traceback
            print(traceback.format_exc())
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': False,
                    'error': error_msg,
                    'type': type(import_err).__name__,
                    'details': str(import_err)
                })
            }
    
    try:
        # Parse request body - Vercel format
        body = req.get('body', '{}')
        if isinstance(body, str):
            form_data = json.loads(body)
        elif isinstance(body, bytes):
            form_data = json.loads(body.decode('utf-8'))
        else:
            form_data = body if body else {}
        
        if not form_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'success': False, 'error': 'No request body'})
            }
        
        # Get templates directory (relative to api folder, go up to root, then templates)
        api_dir = Path(__file__).parent
        root_dir = api_dir.parent
        templates_dir = root_dir / 'templates'
        
        print(f"Looking for templates at: {templates_dir}")
        print(f"Templates directory exists: {templates_dir.exists()}")
        print(f"Root directory: {root_dir}")
        print(f"Root exists: {root_dir.exists()}")
        
        if not templates_dir.exists():
            # Try alternative paths
            alt_paths = [
                root_dir / 'templates',
                Path('/var/task/templates'),  # Vercel lambda path
                Path('/vercel/templates'),
                Path('./templates'),
            ]
            found = False
            for alt_path in alt_paths:
                if alt_path.exists():
                    templates_dir = alt_path
                    found = True
                    print(f"Found templates at alternative path: {alt_path}")
                    break
            
            if not found:
                error_msg = f'Templates directory not found. Searched: {templates_dir}'
                print(f"❌ {error_msg}")
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': error_msg,
                        'searched_paths': [str(p) for p in alt_paths]
                    })
                }
        
        # Create temporary directory for this session
        with tempfile.TemporaryDirectory() as temp_dir:
            # Handle signature image - save it to temp directory if provided
            signature_image_path = None
            if form_data.get('signature_image'):
                signature_base64 = form_data.get('signature_image')
                # Remove data URL prefix if present
                if ',' in signature_base64:
                    signature_base64 = signature_base64.split(',')[1]
                
                signature_image_path = os.path.join(temp_dir, 'signature.png')
                with open(signature_image_path, 'wb') as f:
                    f.write(base64.b64decode(signature_base64))
            
            # Transform form data to match populator's expected structure
            transformed_data = {
                "source_file": "Frontend Input",
                "form_fields": {
                    "personal_details": {
                        "name": form_data.get('name', ''),
                        "gender": form_data.get('gender', ''),
                        "date_of_birth": {
                            "value": form_data.get('date_of_birth', ''),
                            "iso": form_data.get('date_of_birth', '')
                        },
                        "father_name": form_data.get('father_name', ''),
                        "nationality": form_data.get('nationality', ''),
                        "pan_card": form_data.get('pan_card', ''),
                        "aadhar_card": form_data.get('aadhar_card', ''),
                        "din": form_data.get('din', ''),
                        "passport_no": form_data.get('passport_no', ''),
                        "passport_issue_date": {
                            "value": form_data.get('passport_issue_date', ''),
                            "iso": form_data.get('passport_issue_date', '')
                        },
                        "passport_expiry_date": {
                            "value": form_data.get('passport_expiry_date', ''),
                            "iso": form_data.get('passport_expiry_date', '')
                        },
                        "email": form_data.get('email', ''),
                        "religion": form_data.get('religion', ''),
                        "signature_image_path": signature_image_path
                    },
                    "employment_history": [
                        {
                            "employer_name_and_branch": form_data.get('current_employment', {}).get('employer_name_and_branch', ''),
                            "employer_address": form_data.get('current_employment', {}).get('employer_address', ''),
                            "position_and_department": form_data.get('current_employment', {}).get('position_and_department', ''),
                            "landline": form_data.get('current_employment', {}).get('landline', ''),
                            "employment_period": form_data.get('current_employment', {}).get('employment_period', {}),
                            "employee_code": form_data.get('current_employment', {}).get('employee_code', ''),
                            "last_salary": form_data.get('current_employment', {}).get('last_salary', ''),
                            "reason_for_leaving": form_data.get('current_employment', {}).get('reason_for_leaving', ''),
                            "reporting_manager": form_data.get('current_employment', {}).get('reporting_manager', ''),
                            "agency_details": form_data.get('current_employment', {}).get('agency_details', ''),
                            "contract_agency": form_data.get('current_employment', {}).get('contract_agency', ''),
                            "can_verify": form_data.get('current_employment', {}).get('can_verify', True)
                        }
                    ] + (form_data.get('employment_history', []) or []),
                    "education_history": {
                        "highest_qualification": form_data.get('highest_qualification', {}),
                        "previous_qualification": form_data.get('previous_qualification', {})
                    },
                    "address_history": {
                        "current": {
                            "town_or_city_name": form_data.get('current_address', {}).get('full_address', ''),
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": form_data.get('current_address', {}).get('duration_of_stay', {})
                        },
                        "previous": {
                            "town_or_city_name": form_data.get('previous_address', {}).get('full_address', '') if isinstance(form_data.get('previous_address'), dict) else '',
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": {}
                        },
                        "permanent": {
                            "town_or_city_name": form_data.get('permanent_address', {}).get('full_address', ''),
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": form_data.get('permanent_address', {}).get('duration_of_stay', {})
                        }
                    },
                    "address_list": [
                        {
                            "address_type": "current",
                            "town_or_city_name": form_data.get('current_address', {}).get('full_address', ''),
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": form_data.get('current_address', {}).get('duration_of_stay', {})
                        },
                        {
                            "address_type": "permanent", 
                            "town_or_city_name": form_data.get('permanent_address', {}).get('full_address', ''),
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": form_data.get('permanent_address', {}).get('duration_of_stay', {})
                        }
                    ] + ([
                        {
                            "address_type": "previous",
                            "town_or_city_name": addr.get('full_address', ''),
                            "phone_number": form_data.get('phone', ''),
                            "duration_of_stay": addr.get('duration_of_stay', {})
                        } for addr in form_data.get('previous_address', []) if isinstance(addr, dict)
                    ] if isinstance(form_data.get('previous_address'), list) else []),
                    "references": form_data.get('references', []),
                    "gaps": form_data.get('gaps', {}),
                    "epf_and_gratuity": form_data.get('epf_and_gratuity', {})
                }
            }
            
            # Write transformed form data to JSON file
            json_file = os.path.join(temp_dir, 'extracted_data.json')
            with open(json_file, 'w') as f:
                json.dump(transformed_data, f, indent=2)
            
            # Copy templates to temp directory
            temp_templates_dir = os.path.join(temp_dir, 'templates')
            shutil.copytree(str(templates_dir), temp_templates_dir)
            
            # Create output directory
            output_dir = os.path.join(temp_dir, 'output')
            os.makedirs(output_dir, exist_ok=True)
            
            # Set signature image path in environment if available
            env = os.environ.copy()
            if signature_image_path:
                env['SIGNATURE_IMAGE_PATH'] = signature_image_path
            
            # Call populator directly instead of subprocess
            populator = SmartFormPopulator(json_file)
            populator.signature_image_path = signature_image_path
            
            # Process all forms
            count = populator.populate_all_forms(temp_templates_dir, output_dir)
            
            if count == 0:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'No forms were processed successfully'
                    })
                }
            
            # Read output files and convert to base64
            download_links = []
            files_data = {}
            
            for filename in os.listdir(output_dir):
                if filename.endswith('.docx'):
                    file_path = os.path.join(output_dir, filename)
                    with open(file_path, 'rb') as f:
                        file_content = f.read()
                        file_base64 = base64.b64encode(file_content).decode('utf-8')
                    
                    files_data[filename] = file_base64
                    download_links.append({
                        'filename': filename,
                        'url': f'/api/download/{filename}',
                        'type': 'docx'
                    })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Successfully processed {len(download_links)} forms',
                    'downloadLinks': download_links,
                    'files': files_data  # Include base64 encoded files
                })
            }
            
    except ImportError as import_err:
        import traceback
        error_details = traceback.format_exc()
        error_msg = f'Import error: {str(import_err)}'
        print(f"❌ {error_msg}")
        print(f"❌ Full traceback: {error_details}")
        # Return error in a format that's easy for frontend to parse
        error_response = {
            'success': False,
            'error': error_msg,
            'type': 'ImportError',
            'message': error_msg,  # Add message field for Vercel format compatibility
            'code': 500,
            'details': error_details[:500] if len(error_details) > 500 else error_details
        }
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(error_response)
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        error_msg = f'Form processing failed: {str(e)}'
        print(f"❌ {error_msg}")
        print(f"❌ Error type: {type(e).__name__}")
        print(f"❌ Full traceback: {error_details}")
        # Return error in a format that's easy for frontend to parse
        error_response = {
            'success': False,
            'error': error_msg,
            'type': type(e).__name__,
            'message': error_msg,  # Add message field for Vercel format compatibility
            'code': 500,
            'details': error_details[:1000] if len(error_details) > 1000 else error_details
        }
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(error_response)
        }

# Export handler for Vercel (if needed)
__all__ = ['handler']

