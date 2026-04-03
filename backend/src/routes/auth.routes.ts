import { Router } from "express";
import { login, accountVerify, refreshToken, register } from "../controllers/auth.controller";

const router = Router();

router.post('/register', register);
router.post('/authenticate', login);
router.get('/account-verify/:token', accountVerify);
router.get('/refresh-token', refreshToken);

export default router;
