"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustmentRoutes = void 0;
const adjustmentController_1 = require("../contollers/adjustmentController");
const adjustmentRoutes = (server) => {
    server.route([
        {
            method: 'GET',
            path: '/adjustments',
            handler: adjustmentController_1.getAdjustments
        },
        {
            method: 'GET',
            path: '/adjustments/{id}',
            handler: adjustmentController_1.getAdjustment
        },
        {
            method: 'POST',
            path: '/adjustments',
            handler: adjustmentController_1.createAdjustment
        },
        {
            method: 'PUT',
            path: '/adjustments/{id}',
            handler: adjustmentController_1.updateAdjustment
        },
        {
            method: 'DELETE',
            path: '/adjustments/{id}',
            handler: adjustmentController_1.deleteAdjustment
        }
    ]);
};
exports.adjustmentRoutes = adjustmentRoutes;
