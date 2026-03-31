import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.util';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('Basic '))) {
            return errorResponse(res, 'Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token.', 401, error);
    }
};
