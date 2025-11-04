"""
Vercel serverless function for downloading files
Since files are returned as base64 in process-forms response,
this endpoint can retrieve from that or return a redirect
"""
import json
import base64

def handler(req):
    """Download handler - files are returned directly in process-forms response"""
    # Handle CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    if req.get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    # Get filename from query or path
    filename = req.get('query', {}).get('filename') or req.get('path', '').split('/')[-1]
    
    if not filename:
        return {
            'statusCode': 400,
            'headers': {
                **headers,
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': 'Filename required'})
        }
    
    # Note: In the current implementation, files are returned as base64
    # in the process-forms response. This endpoint serves as a placeholder.
    # The frontend should handle files from the process-forms response directly.
    
    return {
        'statusCode': 404,
        'headers': {
            **headers,
            'Content-Type': 'application/json',
        },
        'body': json.dumps({
            'error': 'File not found. Files are returned directly in process-forms response.',
            'note': 'Use the files data from /api/process-forms response'
        })
    }

