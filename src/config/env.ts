import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    NODE_ENV: process.env.NODE_ENV || 'development'
};
