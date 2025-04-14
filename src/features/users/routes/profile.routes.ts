// src/features/users/routes/profile.routes.ts
import { Router } from 'express';
import { getUserProfileController } from '../controllers/profile.controller';
import { authenticateJWT } from '../../middleware/authenticate.middleware';

const router = Router();

router.get('/auth/me', authenticateJWT, getUserProfileController);

export default router;
