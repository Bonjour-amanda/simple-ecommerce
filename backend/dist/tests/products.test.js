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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server"); // Adjust the path according to your project
describe('Adjustment Transactions API', () => {
    it('should fetch all adjustments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (yield server_1.server).inject({
            method: 'GET',
            url: '/adjustments'
        });
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.result)).toBe(true);
    }));
    it('should create a new adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
        const newAdjustment = { sku: 'product-sku', qty: 5 };
        const response = yield (yield server_1.server).inject({
            method: 'POST',
            url: '/adjustments',
            payload: newAdjustment
        });
        expect(response.statusCode).toBe(201);
        expect(response.result).toHaveProperty('id'); // Assuming ID is returned
    }));
    it('should fetch a single adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (yield server_1.server).inject({
            method: 'GET',
            url: '/adjustments/1' // Adjust the ID as necessary
        });
        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('id', 1);
    }));
    it('should update an adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateAdjustment = { sku: 'updated-sku', qty: 10 };
        const response = yield (yield server_1.server).inject({
            method: 'PUT',
            url: '/adjustments/1', // Adjust the ID as necessary
            payload: updateAdjustment
        });
        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('sku', 'updated-sku');
    }));
    it('should delete an adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (yield server_1.server).inject({
            method: 'DELETE',
            url: '/adjustments/1' // Adjust the ID as necessary
        });
        expect(response.statusCode).toBe(204);
    }));
});
