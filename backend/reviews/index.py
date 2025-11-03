import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление отзывами о продавцах и историей продаж
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            seller_email = event.get('queryStringParameters', {}).get('seller_email')
            action = event.get('queryStringParameters', {}).get('action', 'reviews')
            
            if not seller_email:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing seller_email'}),
                    'isBase64Encoded': False
                }
            
            if action == 'get_reviews':
                cur.execute("""
                    SELECT id, reviewer_name, rating, comment, created_at
                    FROM seller_reviews
                    WHERE seller_email = %s
                    ORDER BY created_at DESC
                """, (seller_email,))
                
                rows = cur.fetchall()
                reviews = []
                for row in rows:
                    reviews.append({
                        'id': row[0],
                        'reviewer_name': row[1],
                        'rating': row[2],
                        'comment': row[3],
                        'created_at': row[4].isoformat() if row[4] else None
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(reviews),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_purchases':
                cur.execute("""
                    SELECT id, product_name, product_price, buyer_name, created_at
                    FROM purchase_history
                    WHERE seller_email = %s
                    ORDER BY created_at DESC
                    LIMIT 50
                """, (seller_email,))
                
                rows = cur.fetchall()
                sales = []
                for row in rows:
                    sales.append({
                        'id': row[0],
                        'product_name': row[1],
                        'product_price': float(row[2]),
                        'buyer_name': row[3] if row[3] else 'Анонимный',
                        'created_at': row[4].isoformat() if row[4] else None
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(sales),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'review')
            
            if action == 'add_review':
                seller_email = body_data.get('seller_email', '').strip()
                reviewer_email = body_data.get('reviewer_email', '').strip()
                reviewer_name = body_data.get('reviewer_name', '').strip()
                rating = body_data.get('rating')
                comment = body_data.get('comment', '').strip()
                
                if not all([seller_email, reviewer_email, reviewer_name, rating]):
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO seller_reviews (seller_email, reviewer_email, reviewer_name, rating, comment)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """, (seller_email, reviewer_email, reviewer_name, rating, comment))
                
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Review added'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'purchase':
                product_id = body_data.get('product_id')
                buyer_email = body_data.get('buyer_email', '').strip()
                buyer_name = body_data.get('buyer_name', '').strip()
                seller_email = body_data.get('seller_email', '').strip()
                product_name = body_data.get('product_name', '').strip()
                product_price = body_data.get('product_price')
                
                if not all([product_id, seller_email, product_name, product_price]):
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO purchase_history (product_id, buyer_email, buyer_name, seller_email, product_name, product_price)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (product_id, buyer_email, buyer_name, seller_email, product_name, product_price))
                
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Purchase recorded'}),
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