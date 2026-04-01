import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';
import { CompanyService } from '../services/company.service';
import logger from '../config/logger';

const companyService = new CompanyService();

// create a company
export const createCompany = async (req: Request, res: Response) => {
    try {
        const company = await companyService.create(req.body);
        return successResponse(res, company, 'Company created successfully');
    } catch (error) {
        return errorResponse(res, 'Error creating company', 500, error);
    }
};

//list all company
export const getAllCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await companyService.findAll(req.query);
        return successResponse(res, companies, 'Companies fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Error while fetching companies', 500, error);
    }
};

//update company
export const updateCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`update content`, req.body);
        const company = await companyService.update(String(id), req.body);
        if (!company) {
            return errorResponse(res, 'Company not found', 404);
        }
        return successResponse(res, company, 'Company updated successfully');
    } catch (error) {
        return errorResponse(res, 'Error while updating company', 500, error);
    }
};

//modifycompany
export const modifyCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`modify content`, req.body);
        const company = await companyService.modify(String(id), req.body);
        if (!company) {
            return errorResponse(res, 'Company not found', 404);
        }
        return successResponse(res, company, 'Company modified successfully');
    } catch (error) {
        return errorResponse(res, 'Error while modifying company', 500, error);
    }
};

//delete company
export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const company = await companyService.delete(String(id));
        if (!company) {
            return errorResponse(res, 'Company not found', 404);
        }
        return successResponse(res, company, 'Company deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Error while deleting company', 500, error);
    }
};

