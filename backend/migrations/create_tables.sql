CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(10, 2),
    discount_percentage NUMERIC(5, 2),
    rating NUMERIC(3, 2),
    stock INTEGER,
    tags TEXT[],  -- ARRAY to store tags
    brand VARCHAR(100),
    sku VARCHAR(50),
    weight NUMERIC(10, 2),
    dimensions JSONB,  -- JSONB for storing width, height, depth
    warranty_information TEXT,
    shipping_information TEXT,
    availability_status VARCHAR(50),
    reviews JSONB[],  -- Array of JSONB objects for reviews
    return_policy TEXT,
    minimum_order_quantity INTEGER,
    meta JSONB,  -- JSONB for createdAt, updatedAt, barcode, qrCode
    images TEXT[],  -- Array of URLs
    thumbnail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adjustments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
