import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util';

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        const user = (req as any).user;

        if (!user) {
            return errorResponse(res, 'Unauthorized. Please login.', 401);
        }

        if (!roles.includes(user.role)) {
            return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
        }

        next();
    };
};
