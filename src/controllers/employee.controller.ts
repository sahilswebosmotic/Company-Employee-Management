import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { UserModel } from '../models/employee.model';

export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await UserModel.find();
        return successResponse(res, employees);
    } catch (error) {
        return errorResponse(res, 'Error fetching employees', 500, error);
    }
};

// Other controller methods will be implemented here
