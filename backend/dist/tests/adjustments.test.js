"use strict";
// src/routes/__tests__/adjustments.test.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const hapi_1 = require("@hapi/hapi");
const adjustments_1 = require("../routes/adjustments");
const adjustmentController = __importStar(require("../contollers/adjustmentController")); // Adjust the import path as necessary
jest.mock('../routes/adjustments'); // Mock the database
jest.mock('../contollers/adjustmentController'); // Mock controller functions
describe('Adjustment Routes', () => {
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = new hapi_1.Server();
        (0, adjustments_1.adjustmentRoutes)(server);
        yield server.initialize();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.stop();
    }));
    describe('GET /adjustments', () => {
        it('should return a list of adjustments', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAdjustments = [{ SKU: 'SKU1', qty: 10, amount: 100 }];
            adjustmentController.getAdjustments.mockResolvedValue({
                code: 200,
                source: mockAdjustments,
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/adjustments?page=1&limit=10',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockAdjustments);
        }));
    });
    describe('GET /adjustments/{id}', () => {
        it('should return a single adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAdjustment = { SKU: 'SKU1', qty: 10, amount: 100 };
            adjustmentController.getAdjustment.mockResolvedValue({
                code: 200,
                source: mockAdjustment,
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/adjustments/1',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockAdjustment);
        }));
        it('should return 404 if adjustment not found', () => __awaiter(void 0, void 0, void 0, function* () {
            adjustmentController.getAdjustment.mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/adjustments/999',
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        }));
    });
    describe('POST /adjustments', () => {
        it('should create a new adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAdjustment = { SKU: 'SKU1', qty: 10 };
            adjustmentController.createAdjustment.mockResolvedValue({
                code: 201,
                source: { SKU: 'SKU1', qty: 10, amount: 100 },
            });
            const response = yield server.inject({
                method: 'POST',
                url: '/adjustments',
                payload: newAdjustment,
            });
            expect(response.statusCode).toBe(201);
            expect(response.result).toEqual({ SKU: 'SKU1', qty: 10, amount: 100 });
        }));
        it('should return 404 if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            adjustmentController.createAdjustment.mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });
            const response = yield server.inject({
                method: 'POST',
                url: '/adjustments',
                payload: { SKU: 'INVALIDSKU', qty: 10 },
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        }));
    });
    describe('PUT /adjustments/{id}', () => {
        it('should update an existing adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedAdjustment = { SKU: 'SKU1', qty: 15 };
            adjustmentController.updateAdjustment.mockResolvedValue({
                code: 200,
                source: { SKU: 'SKU1', qty: 15, amount: 150 },
            });
            const response = yield server.inject({
                method: 'PUT',
                url: '/adjustments/1',
                payload: updatedAdjustment,
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ SKU: 'SKU1', qty: 15, amount: 150 });
        }));
        it('should return 404 if adjustment is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            adjustmentController.updateAdjustment.mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });
            const response = yield server.inject({
                method: 'PUT',
                url: '/adjustments/999',
                payload: { SKU: 'SKU1', qty: 15 },
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        }));
    });
    describe('DELETE /adjustments/{id}', () => {
        it('should delete an adjustment', () => __awaiter(void 0, void 0, void 0, function* () {
            adjustmentController.deleteAdjustment.mockResolvedValue({
                code: 200,
                source: { message: 'Adjustment deleted' },
            });
            const response = yield server.inject({
                method: 'DELETE',
                url: '/adjustments/1',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Adjustment deleted' });
        }));
        it('should return 404 if adjustment is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            adjustmentController.deleteAdjustment.mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });
            const response = yield server.inject({
                method: 'DELETE',
                url: '/adjustments/999',
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        }));
    });
});
