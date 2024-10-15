import { Request, ResponseToolkit } from '@hapi/hapi';
import db from '../database';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

// Get a list of products with pagination
export const getProducts = async (request: Request, h: ResponseToolkit) => {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;

    try {
        const products = await db.any('SELECT *, (SELECT SUM(qty) FROM adjustments WHERE sku = p.sku) AS stock FROM products p ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        return h.response(products).code(200);
    } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Get a single product by SKU
export const getProduct = async (request: Request, h: ResponseToolkit) => {
    const { sku } = request.params;

    try {
        const product = await db.oneOrNone('SELECT *, (SELECT SUM(qty) FROM adjustments WHERE sku = $1) AS stock FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        return h.response(product).code(200);
    } catch (error) {
        console.error('Error fetching product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Create a new product
export const createProduct = async (request: Request, h: ResponseToolkit) => {
    const { title, sku, image, price, description } = request.payload as { title: string; sku: string; image: string; price: number; description?: string };

    try {
        // Check for duplicate SKU
        const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (existingProduct) {
            return h.response({ message: 'SKU already exists' }).code(400);
        }

        const newProduct = await db.one(
            'INSERT INTO products(title, sku, image, price, description) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [title, sku, image, price, description]
        );
        return h.response(newProduct).code(201);
    } catch (error) {
        console.error('Error creating product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Update an existing product
export const updateProduct = async (request: Request, h: ResponseToolkit) => {
    const { sku } = request.params;
    const { title, image, price, description } = request.payload as { title?: string; image?: string; price?: number; description?: string };

    try {
        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        const updatedProduct = await db.one(
            'UPDATE products SET title = COALESCE($1, title), image = COALESCE($2, image), price = COALESCE($3, price), description = COALESCE($4, description) WHERE sku = $5 RETURNING *',
            [title, image, price, description, sku]
        );
        return h.response(updatedProduct).code(200);
    } catch (error) {
        console.error('Error updating product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Delete a product
export const deleteProduct = async (request: Request, h: ResponseToolkit) => {
    const { sku } = request.params;

    try {
        const product = await db.oneOrNone('DELETE FROM products WHERE sku = $1 RETURNING *', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        return h.response({ message: 'Product deleted' }).code(204);
    } catch (error) {
        console.error('Error deleting product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

type TProduct = { title: string; sku: string; image: string; price: number; description?: string };

// Fetch products from Dummy JSON and save to the database
export const fetchFromDummyJson = async (request: Request, h: ResponseToolkit) => {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json() as { products: TProduct[] };

        // Loop through the products and insert them into the database
        for (const product of data.products as TProduct[]) {
            // Check for duplicate SKU
            const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [product.sku]);
            if (!existingProduct) {
                await db.none(
                    'INSERT INTO products(title, sku, image, price, description) VALUES($1, $2, $3, $4, $5)',
                    [product.title, product.sku, product.image, product.price, product.description || null]
                );
            }
        }

        return h.response({ message: 'Products fetched and saved' }).code(200);
    } catch (error) {
        console.error('Error fetching products from Dummy JSON:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};
