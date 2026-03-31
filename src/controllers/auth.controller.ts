import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthDAO } from '../daos/auth.dao';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authDao = new AuthDAO();

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', 400);
        }

        const employee = await authDao.findByEmail(email);
        if (!employee) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: employee._id, email: employee.email, role: employee.role },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '30m'
            } as jwt.SignOptions
        );

        return successResponse(res, { token }, 'Login successful');
    } catch (error) {
        return errorResponse(res, 'Login failed', 500, error);
    }
};

export const accountVerify = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;
        if (!token) {
            return errorResponse(res, 'Token is required', 400);
        }

        const decoded = jwt.verify(String(token), process.env.JWT_SECRET as string) as any;
        const employee = await authDao.verifyAccount(decoded.id);

        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }

        return successResponse(res, null, 'Account verified successfully');
    } catch (error) {
        return errorResponse(res, 'Account verification failed or token expired', 401, error);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Authorization header missing or invalid format', 401);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return errorResponse(res, 'Token not provided in Authorization header', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string, { ignoreExpiration: true }) as any;
        
        const newToken = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        return successResponse(res, { token: newToken }, 'Token refreshed successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to refresh token', 401, error);
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, firstName, lastName, designation, companyId,isVerified } = req.body;
        
        if (!email || !password || !firstName || !lastName || !designation || !companyId) {
            return errorResponse(res, 'All fields are required', 400);
        }

        const existingUser = await authDao.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, 'User already exists with this email', 400);
        }

        const newUser = await authDao.create({
            ...req.body,
            role: 'EMPLOYEE' 
        });
        
        return successResponse(res, { 
            id: newUser._id, 
            email: newUser.email 
        }, 'User registered successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Registration failed', 500, error);
    }
};
