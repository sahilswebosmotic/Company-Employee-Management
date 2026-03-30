import { Response } from 'express';
import { RESPONSE_MESSAGES } from '../constants/messages';

export const successResponse = (res: Response, data: any, message: string = RESPONSE_MESSAGES.SUCCESS, statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res: Response, message: string = RESPONSE_MESSAGES.ERROR, statusCode: number = 500, error: any = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error?.message || error
    });
};
