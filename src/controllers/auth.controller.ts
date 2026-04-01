import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return successResponse(res, result, 'Login successful');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Login failed', 401, error);
    }
};

export const accountVerify = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;
        await authService.verifyAccount(token as string);
        return successResponse(res, null, 'Account verified successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Account verification failed', 401, error);
    }
};


export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const authHeader = req.headers.authorization;
        const result = await authService.refreshToken(authHeader);
        return successResponse(res, result, 'Token refreshed successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Failed to refresh token', 401, error);
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await authService.register(req.body);
        return successResponse(res, result, 'User registered successfully', 201);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Registration failed', 400, error);
    }
};

