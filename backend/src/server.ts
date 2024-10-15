import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import dotenv from 'dotenv';
import { adjustmentRoutes } from './routes/adjustments';
import db from './database'; // Adjust path as necessary

dotenv.config();

const init = async () => {
    const server = Hapi.Server({
        port: process.env.PORT || 3002,
        host: 'localhost'
    });

    // Register plugins
    await server.register(Inert);

    // Register routes
    adjustmentRoutes(server);

    // Start the server
    await server.start();
    console.log(`Server running on ${server.info.uri}`);

    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Export the server for testing purposes
export const server = init();