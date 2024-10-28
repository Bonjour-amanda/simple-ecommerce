import { Server } from '@hapi/hapi';
import { productRoutes } from '../routes/products';
import * as productController from '../contollers/productController';

jest.mock('../routes/products'); // Mock the database
jest.mock('../contollers/productController'); // Mock controller functions

describe('Product Routes', () => {
    let server: Server;

    beforeAll(async () => {
        server = new Server();
        productRoutes(server);
        await server.initialize();
    });

    afterAll(async () => {
        await server.stop();
    });

    describe('GET /products', () => {
        it('should return a list of products', async () => {
            const mockProducts = [{ title: 'Product 1', sku: 'SKU1', price: 100 }];
            (productController.getProducts as jest.Mock).mockResolvedValue({
                code: 200,
                source: mockProducts,
            });

            const response = await server.inject({
                method: 'GET',
                url: '/products',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockProducts);
        });
    });

    describe('GET /products/{sku}', () => {
        it('should return a single product', async () => {
            const mockProduct = { title: 'Product 1', sku: 'SKU1', price: 100 };
            (productController.getProduct as jest.Mock).mockResolvedValue({
                code: 200,
                source: mockProduct,
            });

            const response = await server.inject({
                method: 'GET',
                url: '/products/SKU1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockProduct);
        });

        it('should return 404 if product not found', async () => {
            (productController.getProduct as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });

            const response = await server.inject({
                method: 'GET',
                url: '/products/INVALIDSKU',
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        });
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const newProduct = { title: 'Product 1', sku: 'SKU1', price: 100 };
            (productController.createProduct as jest.Mock).mockResolvedValue({
                code: 201,
                source: newProduct,
            });

            const response = await server.inject({
                method: 'POST',
                url: '/products',
                payload: newProduct,
            });

            expect(response.statusCode).toBe(201);
            expect(response.result).toEqual(newProduct);
        });

        it('should return 400 if SKU already exists', async () => {
            (productController.createProduct as jest.Mock).mockResolvedValue({
                code: 400,
                source: { message: 'SKU already exists' },
            });

            const response = await server.inject({
                method: 'POST',
                url: '/products',
                payload: { title: 'Product 1', sku: 'SKU1', price: 100 },
            });

            expect(response.statusCode).toBe(400);
            expect(response.result).toEqual({ message: 'SKU already exists' });
        });
    });

    describe('PUT /products/{sku}', () => {
        it('should update an existing product', async () => {
            const updatedProduct = { title: 'Updated Product', sku: 'SKU1', price: 150 };
            (productController.updateProduct as jest.Mock).mockResolvedValue({
                code: 200,
                source: updatedProduct,
            });

            const response = await server.inject({
                method: 'PUT',
                url: '/products/SKU1',
                payload: { title: 'Updated Product', price: 150 },
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(updatedProduct);
        });

        it('should return 404 if product is not found', async () => {
            (productController.updateProduct as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });

            const response = await server.inject({
                method: 'PUT',
                url: '/products/INVALIDSKU',
                payload: { title: 'Updated Product', price: 150 },
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        });
    });

    describe('DELETE /products/{sku}', () => {
        it('should delete a product', async () => {
            (productController.deleteProduct as jest.Mock).mockResolvedValue({
                code: 200,
                source: { message: 'Product deleted' },
            });

            const response = await server.inject({
                method: 'DELETE',
                url: '/products/SKU1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Product deleted' });
        });

        it('should return 404 if product is not found', async () => {
            (productController.deleteProduct as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });

            const response = await server.inject({
                method: 'DELETE',
                url: '/products/INVALIDSKU',
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        });
    });

    describe('POST /fetch-products', () => {
        it('should fetch and save products from dummy JSON', async () => {
            (productController.fetchFromDummyJson as jest.Mock).mockResolvedValue({
                code: 200,
                source: { message: 'Products fetched and saved' },
            });

            const response = await server.inject({
                method: 'POST',
                url: '/fetch-products',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Products fetched and saved' });
        });
    });
});
