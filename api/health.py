"""
Health check endpoint for Vercel serverless function
"""
import json

def handler(req):
    """Health check handler - Vercel serverless function"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps({'status': 'healthy'})
    }

