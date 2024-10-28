import { Server } from '@hapi/hapi';
import { productRoutes } from './routes/products';
import { adjustmentRoutes } from './routes/adjustments';

const server = new Server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'], // Allow all origins or specify your frontend URL
            credentials: true // Allow credentials (cookies, authorization headers, etc.)
        }
    }
});

const init = async () => {
    productRoutes(server); // Register routes here
    adjustmentRoutes(server);
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
