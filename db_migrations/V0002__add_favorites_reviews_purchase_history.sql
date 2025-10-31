-- Таблица избранного
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, product_id)
);

-- Таблица отзывов о продавцах
CREATE TABLE IF NOT EXISTS seller_reviews (
    id SERIAL PRIMARY KEY,
    seller_email VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории продаж (клики на "Купить")
CREATE TABLE IF NOT EXISTS purchase_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    buyer_email VARCHAR(255),
    buyer_name VARCHAR(255),
    seller_email VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_email);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_seller ON seller_reviews(seller_email);
CREATE INDEX IF NOT EXISTS idx_purchase_history_seller ON purchase_history(seller_email);