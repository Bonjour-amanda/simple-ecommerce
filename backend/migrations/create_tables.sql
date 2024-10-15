CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    stock INT DEFAULT 0
);

CREATE TABLE adjustments (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) REFERENCES products(sku),
    qty INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
);
