import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';

export const login = async (req: Request, res: Response) => {
    try {
        // Login logic
        return successResponse(res, { token: 'sample-token' }, 'Login successful');
    } catch (error) {
        return errorResponse(res, 'Login failed', 401, error);
    }
};

