"""
Test import endpoint to debug Vercel Python issues
"""
import json
import sys
import os

def handler(req):
    """Test handler to check if Python works at all"""
    try:
        # Test basic imports
        test_results = {
            'python_version': sys.version,
            'sys_path': sys.path[:5],  # First 5 paths
            'cwd': os.getcwd(),
            'file_location': __file__ if '__file__' in globals() else 'unknown',
        }
        
        # Try importing standard library
        try:
            import json
            test_results['json_import'] = 'OK'
        except Exception as e:
            test_results['json_import'] = f'FAILED: {str(e)}'
        
        # Try importing pathlib
        try:
            from pathlib import Path
            test_results['pathlib_import'] = 'OK'
        except Exception as e:
            test_results['pathlib_import'] = f'FAILED: {str(e)}'
        
        # Try importing python-docx
        try:
            import docx
            test_results['docx_import'] = 'OK'
        except Exception as e:
            test_results['docx_import'] = f'FAILED: {str(e)}'
        
        # Try importing from lib
        try:
            lib_path = os.path.join(os.path.dirname(__file__), '..', 'lib')
            if os.path.exists(lib_path):
                sys.path.insert(0, lib_path)
                test_results['lib_path'] = lib_path
                test_results['lib_exists'] = True
                if os.path.exists(os.path.join(lib_path, 'populator.py')):
                    test_results['populator_exists'] = True
                    try:
                        from populator import SmartFormPopulator
                        test_results['populator_import'] = 'OK'
                    except Exception as e:
                        test_results['populator_import'] = f'FAILED: {str(e)}'
                else:
                    test_results['populator_exists'] = False
            else:
                test_results['lib_exists'] = False
        except Exception as e:
            test_results['lib_test'] = f'FAILED: {str(e)}'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(test_results)
        }
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': str(e),
                'traceback': traceback.format_exc()
            })
        }

