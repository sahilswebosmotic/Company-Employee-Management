import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';
import logger from './config/logger';

const startServer = async () => {
    try {
        await connectDB();

        app.listen(config.PORT, () => {
            logger.info(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
            logger.info(`Server is running on http://localhost:${config.PORT}`)
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
