import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (payload: object, expiresIn: string = '1d') => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET);
};
