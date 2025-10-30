CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image TEXT,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    seller_email VARCHAR(255) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_seller ON products(seller_email);
CREATE INDEX idx_products_status ON products(status);