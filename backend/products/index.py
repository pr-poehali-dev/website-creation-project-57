import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления товарами пользователей (создание, получение, удаление)
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
            cur.execute("""
                SELECT id, name, price, category, image, rating, seller_email, seller_name, created_at
                FROM products
                WHERE status = 'active'
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            products = []
            for row in rows:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'price': float(row[2]),
                    'category': row[3],
                    'image': row[4],
                    'rating': float(row[5]) if row[5] else 5.0,
                    'seller_email': row[6],
                    'seller_name': row[7],
                    'created_at': row[8].isoformat() if row[8] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(products),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name', '').strip()
            price = body_data.get('price', 0)
            category = body_data.get('category', '').strip()
            image = body_data.get('image', '').strip()
            seller_email = body_data.get('seller_email', '').strip()
            seller_name = body_data.get('seller_name', '').strip()
            
            if not name or not price or not category or not seller_email or not seller_name:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO products (name, price, category, image, seller_email, seller_name)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (name, price, category, image, seller_email, seller_name))
            
            product_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': product_id, 'message': 'Product created successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            product_id = params.get('id')
            user_email = event.get('headers', {}).get('X-User-Email')
            
            if not product_id or not user_email:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing product ID or user email'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE products
                SET status = 'deleted'
                WHERE id = %s AND seller_email = %s
                RETURNING id
            """, (product_id, user_email))
            
            result = cur.fetchone()
            if not result:
                conn.commit()
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product not found or you are not the seller'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Product deleted successfully'}),
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
