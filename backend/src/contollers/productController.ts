import { Request, ResponseToolkit } from '@hapi/hapi';
import db from '../database';

type TProduct = {
    title: string;
    description?: string;
    category?: string;
    price: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    tags?: string[];
    brand?: string;
    sku: string;
    weight?: number;
    dimensions?: object;
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: object[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    meta?: object;
    images?: string[];
    thumbnail?: string;
};

// Get a list of products with pagination
export const getProducts = async (request: Request, h: ResponseToolkit) => {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;
    try {
        const products = await db.any(
            `SELECT 
                title, 
                sku, 
                images, 
                price, 
                (SELECT COALESCE(SUM(qty), 0) FROM adjustments WHERE sku = p.sku) AS stock 
            FROM products p 
            ORDER BY id 
            LIMIT $1 
            OFFSET $2`,
            [limit, offset]
        );
        return h.response(products).code(200);
    } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Get a single product
export const getProduct = async (request: Request, h: ResponseToolkit) => {
    const { sku } = request.params;

    try {
        const product = await db.oneOrNone(
            `SELECT 
                title, sku, images, price, description, 
                (SELECT COALESCE(SUM(qty), 0) FROM adjustments WHERE product_id = p.id) AS stock 
             FROM products p
             WHERE sku = $1`,
            [sku]
        );
        
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
    
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        } catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }

    const { title, sku, images, price, description } = request.payload as Partial<TProduct>;

    try {
        // Check for duplicate SKU
        const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (existingProduct) {
            return h.response({ message: 'SKU already exists' }).code(400);
        }

        const newProduct = await db.one(
            `INSERT INTO products (
                title, sku, images, price, description
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *`,
            [
                title, sku, images, price, description
            ]
        );

        return h.response(newProduct).code(201);
    } catch (error) {
        console.error('Error creating product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Update an existing product
export const updateProduct = async (request: Request, h: ResponseToolkit) => {
        
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        } catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }
    
    const { sku } = request.params;
    const { title, image, price, description } = request.payload as {
        title?: string;
        image?: string;
        price?: number;
        description?: string;
    };

    try {
        // Check if the product exists by SKU
        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        // Update only specified fields using COALESCE to keep existing values if undefined
        const updatedProduct = await db.one(
            `UPDATE products
            SET title = COALESCE($1, title),
                images = COALESCE($2, images),
                price = COALESCE($3, price),
                description = COALESCE($4, description)
            WHERE sku = $5
            RETURNING *`,
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
        return h.response({ message: 'Product deleted' }).code(200);
    } catch (error) {
        console.error('Error deleting product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};


export const fetchFromDummyJson = async (request: Request, h: ResponseToolkit) => {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json() as { products: TProduct[] };

        // Loop through the products and insert them into the database
        for (const product of data.products as TProduct[]) {
            // Check for duplicate SKU
            const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [product.sku]);
            if (!existingProduct) {
                // Convert reviews to JSONB array
                const reviewsJson = product.reviews ? product.reviews.map(review => JSON.stringify(review)) : [];

                await db.none(
                    `INSERT INTO products(
                        title, description, category, price, discount_percentage, rating, stock, tags, brand, sku, weight, dimensions,
                        warranty_information, shipping_information, availability_status, reviews, return_policy, minimum_order_quantity,
                        meta, images, thumbnail
                    ) VALUES(
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb[], $17, $18, $19, $20, $21
                    )`,
                    [
                        product.title, product.description, product.category, product.price, product.discountPercentage, product.rating,
                        product.stock, product.tags, product.brand, product.sku, product.weight, product.dimensions,
                        product.warrantyInformation, product.shippingInformation, product.availabilityStatus, reviewsJson,
                        product.returnPolicy, product.minimumOrderQuantity, product.meta, product.images, product.thumbnail
                    ]
                );
            }
        }

        return h.response({ message: 'Products fetched and saved' }).code(200);
    } catch (error) {
        console.error('Error fetching products from Dummy JSON:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};
