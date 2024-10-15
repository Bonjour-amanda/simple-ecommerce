import { Server } from '@hapi/hapi';
import {
    getAdjustments,
    getAdjustment,
    createAdjustment,
    updateAdjustment,
    deleteAdjustment
} from '../contollers/adjustmentController';

export const adjustmentRoutes = (server: Server) => {
    server.route([
        {
            method: 'GET',
            path: '/adjustments',
            handler: getAdjustments
        },
        {
            method: 'GET',
            path: '/adjustments/{id}',
            handler: getAdjustment
        },
        {
            method: 'POST',
            path: '/adjustments',
            handler: createAdjustment
        },
        {
            method: 'PUT',
            path: '/adjustments/{id}',
            handler: updateAdjustment
        },
        {
            method: 'DELETE',
            path: '/adjustments/{id}',
            handler: deleteAdjustment
        }
    ]);
};
