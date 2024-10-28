import { Server } from '@hapi/hapi';
import { adjustmentRoutes } from '../routes/adjustments';
import * as adjustmentController from '../contollers/adjustmentController'; // Adjust the import path as necessary

jest.mock('../routes/adjustments'); // Mock the database
jest.mock('../contollers/adjustmentController'); // Mock controller functions

describe('Adjustment Routes', () => {
    let server: Server;

    beforeAll(async () => {
        server = new Server();
        adjustmentRoutes(server);
        await server.initialize();
    });

    afterAll(async () => {
        await server.stop();
    });

    describe('GET /adjustments', () => {
        it('should return a list of adjustments', async () => {
            const mockAdjustments = [{ SKU: 'SKU1', qty: 10, amount: 100 }];
            (adjustmentController.getAdjustments as jest.Mock).mockResolvedValue({
                code: 200,
                source: mockAdjustments,
            });

            const response = await server.inject({
                method: 'GET',
                url: '/adjustments?page=1&limit=10',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockAdjustments);
        });
    });

    describe('GET /adjustments/{id}', () => {
        it('should return a single adjustment', async () => {
            const mockAdjustment = { SKU: 'SKU1', qty: 10, amount: 100 };
            (adjustmentController.getAdjustment as jest.Mock).mockResolvedValue({
                code: 200,
                source: mockAdjustment,
            });

            const response = await server.inject({
                method: 'GET',
                url: '/adjustments/1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(mockAdjustment);
        });

        it('should return 404 if adjustment not found', async () => {
            (adjustmentController.getAdjustment as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });

            const response = await server.inject({
                method: 'GET',
                url: '/adjustments/999',
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        });
    });

    describe('POST /adjustments', () => {
        it('should create a new adjustment', async () => {
            const newAdjustment = { SKU: 'SKU1', qty: 10 };
            (adjustmentController.createAdjustment as jest.Mock).mockResolvedValue({
                code: 201,
                source: { SKU: 'SKU1', qty: 10, amount: 100 },
            });

            const response = await server.inject({
                method: 'POST',
                url: '/adjustments',
                payload: newAdjustment,
            });

            expect(response.statusCode).toBe(201);
            expect(response.result).toEqual({ SKU: 'SKU1', qty: 10, amount: 100 });
        });

        it('should return 404 if product not found', async () => {
            (adjustmentController.createAdjustment as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Product not found' },
            });

            const response = await server.inject({
                method: 'POST',
                url: '/adjustments',
                payload: { SKU: 'INVALIDSKU', qty: 10 },
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Product not found' });
        });
    });

    describe('PUT /adjustments/{id}', () => {
        it('should update an existing adjustment', async () => {
            const updatedAdjustment = { SKU: 'SKU1', qty: 15 };
            (adjustmentController.updateAdjustment as jest.Mock).mockResolvedValue({
                code: 200,
                source: { SKU: 'SKU1', qty: 15, amount: 150 },
            });

            const response = await server.inject({
                method: 'PUT',
                url: '/adjustments/1',
                payload: updatedAdjustment,
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ SKU: 'SKU1', qty: 15, amount: 150 });
        });

        it('should return 404 if adjustment is not found', async () => {
            (adjustmentController.updateAdjustment as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });

            const response = await server.inject({
                method: 'PUT',
                url: '/adjustments/999',
                payload: { SKU: 'SKU1', qty: 15 },
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        });
    });

    describe('DELETE /adjustments/{id}', () => {
        it('should delete an adjustment', async () => {
            (adjustmentController.deleteAdjustment as jest.Mock).mockResolvedValue({
                code: 200,
                source: { message: 'Adjustment deleted' },
            });

            const response = await server.inject({
                method: 'DELETE',
                url: '/adjustments/1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message: 'Adjustment deleted' });
        });

        it('should return 404 if adjustment is not found', async () => {
            (adjustmentController.deleteAdjustment as jest.Mock).mockResolvedValue({
                code: 404,
                source: { message: 'Adjustment not found' },
            });

            const response = await server.inject({
                method: 'DELETE',
                url: '/adjustments/999',
            });

            expect(response.statusCode).toBe(404);
            expect(response.result).toEqual({ message: 'Adjustment not found' });
        });
    });
});
