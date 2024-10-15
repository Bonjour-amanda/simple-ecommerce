import { Request, ResponseToolkit } from '@hapi/hapi';
import db from '../database';

// Get a list of adjustments with pagination
export const getAdjustments = async (request: Request, h: ResponseToolkit) => {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;

    try {
        const adjustments = await db.any('SELECT * FROM adjustments ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        return h.response(adjustments).code(200);
    } catch (error) {
        console.error('Error fetching adjustments:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Get a single adjustment by ID
export const getAdjustment = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    try {
        const adjustment = await db.oneOrNone('SELECT * FROM adjustments WHERE id = $1', [id]);
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
    const { sku, qty } = request.payload as { sku: string; qty: number };

    try {
        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        const newAmount = product.price * qty;
        const adjustment = await db.one(
            'INSERT INTO adjustments(sku, qty, amount) VALUES($1, $2, $3) RETURNING *',
            [sku, qty, newAmount]
        );
        return h.response(adjustment).code(201);
    } catch (error) {
        console.error('Error creating adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Update an existing adjustment
export const updateAdjustment = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const { sku, qty } = request.payload as { sku: string; qty: number };

    try {
        const adjustment = await db.oneOrNone('SELECT * FROM adjustments WHERE id = $1', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }

        const product = await db.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }

        const newAmount = product.price * qty;
        const updatedAdjustment = await db.one(
            'UPDATE adjustments SET sku = $1, qty = $2, amount = $3 WHERE id = $4 RETURNING *',
            [sku, qty, newAmount, id]
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
        return h.response({ message: 'Adjustment deleted' }).code(204);
    } catch (error) {
        console.error('Error deleting adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

