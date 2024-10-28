import { Server } from '@hapi/hapi';
import { productRoutes } from './routes/products';
import { adjustmentRoutes } from './routes/adjustments';

const server: Server = new Server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {
    productRoutes(server); // Register routes here
    adjustmentRoutes(server)
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
