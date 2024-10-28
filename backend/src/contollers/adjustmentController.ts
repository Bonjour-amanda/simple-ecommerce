import { Request, ResponseToolkit } from '@hapi/hapi';
import db from '../database';

// Get a list of adjustments with pagination, showing only sku, qty, and amount
export const getAdjustments = async (request: Request, h: ResponseToolkit) => {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;

    try {
        const adjustments = await db.any(
            'SELECT id, product_sku as SKU, qty , amount FROM adjustments ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return h.response(adjustments).code(200);
    } catch (error) {
        console.error('Error fetching adjustments:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Get a single adjustment by ID, showing only sku, qty, and amount
export const getAdjustment = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    try {
        const adjustment = await db.oneOrNone(
            'SELECT product_sku as SK, qty, amount FROM adjustments WHERE id = $1',
            [id]
        );
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }
        return h.response(adjustment).code(200);
    } catch (error) {
        console.error('Error fetching adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};


// Create a new adjustment
export const createAdjustment = async (request: Request, h: ResponseToolkit) => {
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        } catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }
    
    const { sku, qty } = request.payload as { sku: string; qty: number };

    try {
        // Fetch the product to check current stock and price
        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        // Calculate current stock based on adjustments
        const currentStock = await db.one('SELECT COALESCE(SUM(qty), 0) AS stock FROM adjustments WHERE product_id = $1', [product.id]);
        if (currentStock.stock + qty < 0) {
            return h.response({ message: 'Insufficient stock for adjustment' }).code(400);
        }

        // Calculate amount based on product price and quantity
        const amount = product.price * qty;

        // Insert the new adjustment
        const adjustment = await db.one(
            'INSERT INTO adjustments(product_sku, product_id, qty, amount) VALUES($1, $2, $3, $4) RETURNING *',
            [product.sku, product.id, qty, amount]
        );

        return h.response(adjustment).code(201);
    } catch (error) {
        console.error('Error creating adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Update an existing adjustment
export const updateAdjustment = async (request: Request, h: ResponseToolkit) => {
    
    if (typeof request.payload === 'string') {
        try {
            request.payload = JSON.parse(request.payload);
        } catch (error) {
            console.error('Error parsing request.payload:', error);
            return h.response({ message: 'Invalid JSON format' }).code(400);
        }
    }
     
    const { id } = request.params;
    const { sku, qty } = request.payload as { sku: string; qty: number };

    try {
        // Check if adjustment exists
        const adjustment = await db.oneOrNone('SELECT * FROM adjustments WHERE id = $1', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }

        // Check if product exists
        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        // Calculate current stock and check if update is feasible
        const currentStock = await db.one('SELECT COALESCE(SUM(qty), 0) AS stock FROM adjustments WHERE product_id = $1', [product.id]);
        if (currentStock.stock + qty - adjustment.qty < 0) {
            return h.response({ message: 'Insufficient stock for adjustment' }).code(400);
        }

        // Calculate new amount
        const newAmount = product.price * qty;

        // Update the adjustment
        const updatedAdjustment = await db.one(
            'UPDATE adjustments SET product_sku = $1, product_id = $2, qty = $3, amount = $4 WHERE id = $5 RETURNING *',
            [product.sku, product.id, qty, newAmount, id]
        );

        return h.response(updatedAdjustment).code(200);
    } catch (error) {
        console.error('Error updating adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Delete an adjustment
export const deleteAdjustment = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    try {
        const adjustment = await db.oneOrNone('DELETE FROM adjustments WHERE id = $1 RETURNING *', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }
        return h.response({ message: 'Adjustment deleted' }).code(200);
    } catch (error) {
        console.error('Error deleting adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};


