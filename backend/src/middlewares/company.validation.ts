import { body } from 'express-validator';

export const companyValidation = [
    body('name').notEmpty().withMessage('Company name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
];
