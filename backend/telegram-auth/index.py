'''
Business: Send verification code to Telegram and verify it for user authentication
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with request_id, function_name attributes
Returns: HTTP response dict with verification result
'''

import json
import random
import string
import time
from typing import Dict, Any, Tuple

verification_codes: Dict[str, Tuple[str, float]] = {}
CODE_EXPIRY_SECONDS = 300

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'send_code':
            telegram_username = body_data.get('telegram_username', '')
            if not telegram_username:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Telegram username required'})
                }
            
            code = ''.join(random.choices(string.digits, k=6))
            current_time = time.time()
            verification_codes[telegram_username] = (code, current_time)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': f'Код отправлен. Для демо: {code}',
                    'telegram_link': f'https://t.me/CeTzyyy?text=Код верификации: {code}',
                    'expires_in': CODE_EXPIRY_SECONDS
                })
            }
        
        elif action == 'verify_code':
            telegram_username = body_data.get('telegram_username', '')
            code = body_data.get('code', '')
            
            if not telegram_username or not code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username and code required'})
                }
            
            stored_data = verification_codes.get(telegram_username)
            
            if not stored_data:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Код не найден или истек'})
                }
            
            stored_code, timestamp = stored_data
            current_time = time.time()
            
            if current_time - timestamp > CODE_EXPIRY_SECONDS:
                del verification_codes[telegram_username]
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Код истек. Запросите новый'})
                }
            
            if stored_code == code:
                del verification_codes[telegram_username]
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'verified': True})
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Неверный код'})
                }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }