import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.create(req.body);
        if (!employee) {
            return errorResponse(res, 'Employee not created', 400);
        }
        return successResponse(res, employee, 'Employee created successfully');
    } catch (error) {
        return errorResponse(res, 'Error creating employee', 500, error);
    }
};

export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.findAll(req.query);
        return successResponse(res, employees, 'Employees fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Error fetching employees', 500, error);
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.findById(String(id));
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res, employee, 'Employee fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Error fetching employee', 500, error);
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.update(String(id), req.body);
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res, employee, 'Employee updated successfully');
    } catch (error) {
        return errorResponse(res, 'Error updating employee', 500, error);
    }
};

export const modifyEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.modify(String(id), req.body);
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res, employee, 'Employee modified successfully');
    } catch (error) {
        return errorResponse(res, 'Error modifying employee', 500, error);
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.delete(String(id));
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res, employee, 'Employee deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Error deleting employee', 500, error);
    }
};

