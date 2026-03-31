import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { EmployeeDAO } from '../daos/employee.dao';

const employeeDao = new EmployeeDAO();

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeDao.create(req.body);
        if(!employee){
            return errorResponse(res, 'Employee not created', 400);
        }
        return successResponse(res,employee,'Employee created successfully');
    } catch (error) {
        return errorResponse(res, 'Error creating employee', 500, error);
    }
};

export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const { designation, email, name, search } = req.query;
        let matchStage:any= {};

        // Designation filter (case-insensitive)
        if (designation) {
            matchStage.designation = { $regex: designation, $options: 'i' };
        }

        // Email filter (case-insensitive partial match)
        if (email) {
            matchStage.email = { $regex: email, $options: 'i' };
        }

        // Name filter (matches firstName OR lastName, case-insensitive)
        if (name) {
            matchStage.$or = [
                { firstName: { $regex: name, $options: 'i' } },
                { lastName: { $regex: name, $options: 'i' } }
            ];
        }

        // Broad Search across multiple fields
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const existingOr = matchStage.$or || [];
            
            matchStage.$or = [
                ...existingOr,
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { designation: searchRegex }
            ];
        }

        const employees = await employeeDao.find(matchStage);

        return successResponse(res, employees, 'Employees fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Error fetching employees', 500, error);
    }
};

export const getEmployeeById = async (req:Request , res:Response) =>{
    try {
        const {id} = req.params;
        const employee = await employeeDao.findById(String(id));
        if(!employee){
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res,employee,'Employee fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Error fetching employee', 500, error);
    }
}
export const updateEmployee = async (req:Request,res:Response)=>{
    try {
        const {id} = req.params;   
        const employee = await employeeDao.findByIdAndUpdate(String(id),req.body);
        if(!employee){
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res,employee,'Employee updated successfully');
    } catch (error) {
        return errorResponse(res, 'Error updating employee', 500, error);
    }
}


export const modifyEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await employeeDao.findByIdAndUpdate(String(id), { $set: req.body });
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }
        return successResponse(res, employee, 'Employee modified successfully');
    } catch (error) {
        return errorResponse(res, 'Error modifying employee', 500, error);
    }
}

export const deleteEmployee = async (req:Request,res:Response)=>{
    try {
        const {id} = req.params;   
        const employee = await employeeDao.findByIdAndDelete(String(id));
        if(!employee){
            return errorResponse(res,'Employee not found',404);
        }
        return successResponse(res,employee,'Employee deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Error deleting employee', 500, error);
    }
}
