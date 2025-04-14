// src/features/users/routes/login.routes.ts
import { Router } from 'express';
import { loginUserController, loginAdminController } from '../controllers/login.controller';

const router = Router();

router.post('/auth/login', loginUserController);
router.post('/admin/auth/login', loginAdminController);

export default router;
