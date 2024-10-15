// src/routes/products.ts
import { Server } from '@hapi/hapi';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, fetchFromDummyJson } from '../contollers/productController';

export const productRoutes = (server: Server) => {
    server.route([
        { method: 'GET', path: '/products', handler: getProducts },
        { method: 'GET', path: '/products/{sku}', handler: getProduct },
        { method: 'POST', path: '/products', handler: createProduct },
        { method: 'PUT', path: '/products/{sku}', handler: updateProduct },
        { method: 'DELETE', path: '/products/{sku}', handler: deleteProduct },
        { method: 'POST', path: '/fetch-products', handler: fetchFromDummyJson }
    ]);
};
