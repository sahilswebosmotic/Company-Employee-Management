import { Router } from "express";
import {
    createCompany,
    getAllCompanies,
    updateCompany,
    modifyCompany,
    deleteCompany,
    getCompanywithStatusFilter,
    getCompanywithEmailFilter,
    getCompanywithNameFilter,
    getCompanyByFilter,
} from "../controllers/company.controller";

const router = Router();
router.post('/', createCompany);
router.get('/', getAllCompanies);
router.put('/:id', updateCompany);
router.patch('/:id', modifyCompany);
router.delete('/:id', deleteCompany);
router.get('/filter', getCompanyByFilter);
router.get('/filter/status', getCompanywithStatusFilter);
router.get('/filter/email', getCompanywithEmailFilter);
router.get('/filter/name', getCompanywithNameFilter);

export default router;
