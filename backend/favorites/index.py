import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление избранными товарами пользователей
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if method == 'GET':
            user_email = event.get('queryStringParameters', {}).get('user_email')
            if not user_email:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_email'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT f.product_id, p.name, p.price, p.category, p.image, p.rating
                FROM favorites f
                JOIN products p ON f.product_id = p.id
                WHERE f.user_email = %s AND p.status = 'active'
                ORDER BY f.created_at DESC
            """, (user_email,))
            
            rows = cur.fetchall()
            favorites = []
            for row in rows:
                favorites.append({
                    'id': row[0],
                    'name': row[1],
                    'price': float(row[2]),
                    'category': row[3],
                    'image': row[4],
                    'rating': float(row[5]) if row[5] else 5.0
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(favorites),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_email = body_data.get('user_email', '').strip()
            product_id = body_data.get('product_id')
            
            if not user_email or not product_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO favorites (user_email, product_id)
                VALUES (%s, %s)
                ON CONFLICT (user_email, product_id) DO NOTHING
                RETURNING id
            """, (user_email, product_id))
            
            result = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Added to favorites'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            user_email = params.get('user_email')
            product_id = params.get('product_id')
            
            if not user_email or not product_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing parameters'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM favorites
                WHERE user_email = %s AND product_id = %s
            """, (user_email, product_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Removed from favorites'}),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
