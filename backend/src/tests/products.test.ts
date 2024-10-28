// const server = Hapi.server({
//     port: 3000,
//     host: 'localhost'
// });

// describe('Adjustment Transactions API', () => {
//     it('should fetch all adjustments', async () => {
//         const response = await (await server).inject({
//             method: 'GET',
//             url: '/adjustments'
//         });
//         expect(response.statusCode).toBe(200);
//         expect(Array.isArray(response.result)).toBe(true);
//     });

//     it('should create a new adjustment', async () => {
//         const newAdjustment = { sku: 'product-sku', qty: 5 };
//         const response = await (await server).inject({
//             method: 'POST',
//             url: '/adjustments',
//             payload: newAdjustment
//         });
//         expect(response.statusCode).toBe(201);
//         expect(response.result).toHaveProperty('id'); // Assuming ID is returned
//     });

//     it('should fetch a single adjustment', async () => {
//         const response = await (await server).inject({
//             method: 'GET',
//             url: '/adjustments/1' // Adjust the ID as necessary
//         });
//         expect(response.statusCode).toBe(200);
//         expect(response.result).toHaveProperty('id', 1);
//     });

//     it('should update an adjustment', async () => {
//         const updateAdjustment = { sku: 'updated-sku', qty: 10 };
//         const response = await (await server).inject({
//             method: 'PUT',
//             url: '/adjustments/1', // Adjust the ID as necessary
//             payload: updateAdjustment
//         });
//         expect(response.statusCode).toBe(200);
//         expect(response.result).toHaveProperty('sku', 'updated-sku');
//     });

//     it('should delete an adjustment', async () => {
//         const response = await (await server).inject({
//             method: 'DELETE',
//             url: '/adjustments/1' // Adjust the ID as necessary
//         });
//         expect(response.statusCode).toBe(204);
//     });
// });