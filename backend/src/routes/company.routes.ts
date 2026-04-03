import { Router } from "express";
import {
    createCompany,
    getAllCompanies,
    updateCompany,
    modifyCompany,
    deleteCompany
} from "../controllers/company.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post('/', authorize(['SUPER_ADMIN']), createCompany);
router.get('/', getAllCompanies);
router.put('/:id', authorize(['SUPER_ADMIN']), updateCompany);
router.patch('/:id', authorize(['SUPER_ADMIN']), modifyCompany);
router.delete('/:id', authorize(['SUPER_ADMIN']), deleteCompany);

export default router;
