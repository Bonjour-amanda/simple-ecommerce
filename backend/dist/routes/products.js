"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const productController_1 = require("../contollers/productController");
const productRoutes = (server) => {
    server.route([
        { method: 'GET', path: '/products', handler: productController_1.getProducts },
        { method: 'GET', path: '/products/{sku}', handler: productController_1.getProduct },
        { method: 'POST', path: '/products', handler: productController_1.createProduct },
        { method: 'PUT', path: '/products/{sku}', handler: productController_1.updateProduct },
        { method: 'DELETE', path: '/products/{sku}', handler: productController_1.deleteProduct },
        { method: 'POST', path: '/fetch-products', handler: productController_1.fetchFromDummyJson }
    ]);
};
exports.productRoutes = productRoutes;
