"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFromDummyJson = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const database_1 = __importDefault(require("../database"));
// Get a list of products with pagination
const getProducts = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;
    try {
        const products = yield database_1.default.any(`SELECT 
                title, 
                sku, 
                (SELECT images[1] FROM products WHERE sku = p.sku) AS image, 
                price, 
                (SELECT COALESCE(SUM(qty), 0) FROM adjustments WHERE sku = p.sku) AS stock 
            FROM products p 
            ORDER BY id 
            LIMIT $1 
            OFFSET $2`, [limit, offset]);
        return h.response(products).code(200);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.getProducts = getProducts;
// Get a single product
const getProduct = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { sku } = request.params;
    try {
        const product = yield database_1.default.oneOrNone(`SELECT 
                title, sku, images AS image, price, description, 
                (SELECT COALESCE(SUM(qty), 0) FROM adjustments WHERE product_id = p.id) AS stock 
             FROM products p
             WHERE sku = $1`, [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        return h.response(product).code(200);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.getProduct = getProduct;
// Create a new product
const createProduct = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        }
        catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }
    const { title, sku, images, price, description } = request.payload;
    try {
        // Check for duplicate SKU
        const existingProduct = yield database_1.default.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (existingProduct) {
            return h.response({ message: 'SKU already exists' }).code(400);
        }
        const newProduct = yield database_1.default.one(`INSERT INTO products (
                title, sku, images, price, description
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *`, [
            title, sku, images, price, description
        ]);
        return h.response(newProduct).code(201);
    }
    catch (error) {
        console.error('Error creating product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.createProduct = createProduct;
// Update an existing product
const updateProduct = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        }
        catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }
    const { sku } = request.params;
    const { title, image, price, description } = request.payload;
    try {
        // Check if the product exists by SKU
        const product = yield database_1.default.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        // Update only specified fields using COALESCE to keep existing values if undefined
        const updatedProduct = yield database_1.default.one(`UPDATE products
            SET title = COALESCE($1, title),
                images = COALESCE($2, images),
                price = COALESCE($3, price),
                description = COALESCE($4, description)
            WHERE sku = $5
            RETURNING *`, [title, image, price, description, sku]);
        return h.response(updatedProduct).code(200);
    }
    catch (error) {
        console.error('Error updating product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { sku } = request.params;
    try {
        const product = yield database_1.default.oneOrNone('DELETE FROM products WHERE sku = $1 RETURNING *', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        return h.response({ message: 'Product deleted' }).code(200);
    }
    catch (error) {
        console.error('Error deleting product:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.deleteProduct = deleteProduct;
const fetchFromDummyJson = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('https://dummyjson.com/products');
        const data = yield response.json();
        // Loop through the products and insert them into the database
        for (const product of data.products) {
            // Check for duplicate SKU
            const existingProduct = yield database_1.default.oneOrNone('SELECT * FROM products WHERE sku = $1', [product.sku]);
            if (!existingProduct) {
                // Convert reviews to JSONB array
                const reviewsJson = product.reviews ? product.reviews.map(review => JSON.stringify(review)) : [];
                yield database_1.default.none(`INSERT INTO products(
                        title, description, category, price, discount_percentage, rating, stock, tags, brand, sku, weight, dimensions,
                        warranty_information, shipping_information, availability_status, reviews, return_policy, minimum_order_quantity,
                        meta, images, thumbnail
                    ) VALUES(
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb[], $17, $18, $19, $20, $21
                    )`, [
                    product.title, product.description, product.category, product.price, product.discountPercentage, product.rating,
                    product.stock, product.tags, product.brand, product.sku, product.weight, product.dimensions,
                    product.warrantyInformation, product.shippingInformation, product.availabilityStatus, reviewsJson,
                    product.returnPolicy, product.minimumOrderQuantity, product.meta, product.images, product.thumbnail
                ]);
            }
        }
        return h.response({ message: 'Products fetched and saved' }).code(200);
    }
    catch (error) {
        console.error('Error fetching products from Dummy JSON:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.fetchFromDummyJson = fetchFromDummyJson;
