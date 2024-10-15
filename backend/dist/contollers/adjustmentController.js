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
exports.deleteAdjustment = exports.updateAdjustment = exports.createAdjustment = exports.getAdjustment = exports.getAdjustments = void 0;
const database_1 = __importDefault(require("../database"));
// Get a list of adjustments with pagination
const getAdjustments = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;
    try {
        const adjustments = yield database_1.default.any('SELECT * FROM adjustments ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        return h.response(adjustments).code(200);
    }
    catch (error) {
        console.error('Error fetching adjustments:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.getAdjustments = getAdjustments;
// Get a single adjustment by ID
const getAdjustment = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const adjustment = yield database_1.default.oneOrNone('SELECT * FROM adjustments WHERE id = $1', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }
        return h.response(adjustment).code(200);
    }
    catch (error) {
        console.error('Error fetching adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.getAdjustment = getAdjustment;
// Create a new adjustment
const createAdjustment = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { sku, qty } = request.payload;
    try {
        const product = yield database_1.default.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        const newAmount = product.price * qty;
        const adjustment = yield database_1.default.one('INSERT INTO adjustments(sku, qty, amount) VALUES($1, $2, $3) RETURNING *', [sku, qty, newAmount]);
        return h.response(adjustment).code(201);
    }
    catch (error) {
        console.error('Error creating adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.createAdjustment = createAdjustment;
// Update an existing adjustment
const updateAdjustment = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { sku, qty } = request.payload;
    try {
        const adjustment = yield database_1.default.oneOrNone('SELECT * FROM adjustments WHERE id = $1', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }
        const product = yield database_1.default.oneOrNone('SELECT * FROM products WHERE sku = $1', [sku]);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        const newAmount = product.price * qty;
        const updatedAdjustment = yield database_1.default.one('UPDATE adjustments SET sku = $1, qty = $2, amount = $3 WHERE id = $4 RETURNING *', [sku, qty, newAmount, id]);
        return h.response(updatedAdjustment).code(200);
    }
    catch (error) {
        console.error('Error updating adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.updateAdjustment = updateAdjustment;
// Delete an adjustment
const deleteAdjustment = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const adjustment = yield database_1.default.oneOrNone('DELETE FROM adjustments WHERE id = $1 RETURNING *', [id]);
        if (!adjustment) {
            return h.response({ message: 'Adjustment not found' }).code(404);
        }
        return h.response({ message: 'Adjustment deleted' }).code(204);
    }
    catch (error) {
        console.error('Error deleting adjustment:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
});
exports.deleteAdjustment = deleteAdjustment;
