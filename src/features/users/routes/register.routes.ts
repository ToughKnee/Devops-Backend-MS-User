import { Router } from 'express';
import { registerUserController, registerAdminController } from '../controllers/register.controller';

const router = Router();

router.post('/auth/register', registerUserController);
router.post('/admin/auth/register', registerAdminController);

export default router;