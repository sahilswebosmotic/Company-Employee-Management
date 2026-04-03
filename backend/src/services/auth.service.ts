import { AuthDAO } from '../daos/auth.dao';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.util';

const authDao = new AuthDAO();

export class AuthService {
    async login(email: string, pass: string) {
        if (!email || !pass) {
            throw new Error('Email and password are required');
        }

        const employee = await authDao.findByEmail(email);
        if (!employee) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, employee.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: employee._id, email: employee.email, role: employee.role },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '30m'
            } as jwt.SignOptions
        );

        return { token };
    }

    async register(data: any) {
        const { email, password, firstName, lastName, designation, companyId, isVerified } = data;
        
        if (!email || !password || !firstName || !lastName || !designation || !companyId || isVerified === undefined) {
            throw new Error('All fields are required');
        }

        const existingUser = await authDao.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        const newUser = await authDao.create({
            ...data,
            role: 'EMPLOYEE' 
        });
        
        await sendEmail(email, 'Account Verification', `<h1>Account Verification</h1><p>Click on the link to verify your account: <a href="http://localhost:5000/account-verify/${newUser._id}">Verify Account</a></p>`);

        return { 
            id: newUser._id, 
            email: newUser.email 
        };
    }

    async verifyAccount(token: string) {
        if (!token) {
            throw new Error('Token is required');
        }

        try {
            const decoded = jwt.verify(String(token), process.env.JWT_SECRET as string) as any;
            const employee = await authDao.verifyAccount(decoded.id);

            if (!employee) {
                throw new Error('Employee not found');
            }

            return employee;
        } catch (error) {
            throw new Error('Account verification failed or token expired');
        }
    }

    async refreshToken(authHeader: string | undefined) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authorization header missing or invalid format');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Token not provided in Authorization header');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string, { ignoreExpiration: true }) as any;
            
            const newToken = jwt.sign(
                { id: decoded.id, email: decoded.email, role: decoded.role },
                process.env.JWT_SECRET as string,
                { expiresIn: process.env.JWT_EXPIRES_IN } as jwt.SignOptions
            );

            return { token: newToken };
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    }
}

