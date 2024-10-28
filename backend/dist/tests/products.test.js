"use strict";
// src/routes/__tests__/products.test.ts
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
const products_1 = require("../routes/products");
const productController = __importStar(require("../contollers/productController"));
jest.mock('../routes/products'); // Mock the database
jest.mock('../contollers/productController'); // Mock controller functions
describe('Product Routes', () => {
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = new hapi_1.Server();
        (0, products_1.productRoutes)(server);
        yield server.initialize();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.stop();
    }));
    describe('GET /products', () => {
        it('should return a list of products', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProducts = [{ title: 'Product 1', sku: 'SKU1', price: 100 }];
            productController.getProducts.mockResolvedValue({
                code: 200,
                source: mockProducts,
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/products',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockProducts);
        }));
    });
    describe('GET /products/{sku}', () => {
        it('should return a single product', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = { title: 'Product 1', sku: 'SKU1', price: 100 };
            productController.getProduct.mockResolvedValue({
                code: 200,
                source: mockProduct,
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/products/SKU1',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockProduct);
        }));
        it('should return 404 if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.getProduct.mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });
            const response = yield server.inject({
                method: 'GET',
                url: '/products/INVALIDSKU',
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        }));
    });
    describe('POST /products', () => {
        it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProduct = { title: 'Product 1', sku: 'SKU1', price: 100 };
            productController.createProduct.mockResolvedValue({
                code: 201,
                source: newProduct,
            });
            const response = yield server.inject({
                method: 'POST',
                url: '/products',
                payload: newProduct,
            });
            expect(response.statusCode).toBe(201);
            expect(response.result).toEqual(newProduct);
        }));
        it('should return 400 if SKU already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.createProduct.mockResolvedValue({
                code: 400,
                source: { message: 'SKU already exists' },
            });
            const response = yield server.inject({
                method: 'POST',
                url: '/products',
                payload: { title: 'Product 1', sku: 'SKU1', price: 100 },
            });
            expect(response.statusCode).toBe(400);
            expect(response.result).toEqual({ message: 'SKU already exists' });
        }));
    });
    describe('PUT /products/{sku}', () => {
        it('should update an existing product', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedProduct = { title: 'Updated Product', sku: 'SKU1', price: 150 };
            productController.updateProduct.mockResolvedValue({
                code: 200,
                source: updatedProduct,
            });
            const response = yield server.inject({
                method: 'PUT',
                url: '/products/SKU1',
                payload: { title: 'Updated Product', price: 150 },
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(updatedProduct);
        }));
        it('should return 404 if product is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.updateProduct.mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });
            const response = yield server.inject({
                method: 'PUT',
                url: '/products/INVALIDSKU',
                payload: { title: 'Updated Product', price: 150 },
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        }));
    });
    describe('DELETE /products/{sku}', () => {
        it('should delete a product', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.deleteProduct.mockResolvedValue({
                code: 200,
                source: { message: 'Product deleted' },
            });
            const response = yield server.inject({
                method: 'DELETE',
                url: '/products/SKU1',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Product deleted' });
        }));
        it('should return 404 if product is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.deleteProduct.mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });
            const response = yield server.inject({
                method: 'DELETE',
                url: '/products/INVALIDSKU',
            });
            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        }));
    });
    describe('POST /fetch-products', () => {
        it('should fetch and save products from dummy JSON', () => __awaiter(void 0, void 0, void 0, function* () {
            productController.fetchFromDummyJson.mockResolvedValue({
                code: 200,
                source: { message: 'Products fetched and saved' },
            });
            const response = yield server.inject({
                method: 'POST',
                url: '/fetch-products',
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Products fetched and saved' });
        }));
    });
});
