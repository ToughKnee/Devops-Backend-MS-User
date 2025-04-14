import { Router, RequestHandler } from 'express';
import { registerUserController, registerAdminController } from '../controllers/register.controller';
import { validateAuth, authenticateJWT, AuthenticatedRequest } from '../../middleware/authenticate.middleware';

const router = Router();

// User registration - only needs Firebase auth
router.post('/user/auth/register', validateAuth, registerUserController);

// Admin registration - needs both Firebase auth and JWT role validation
// First validate JWT and role, then validate Firebase token
router.post('/admin/auth/register', authenticateJWT, validateAuth, registerAdminController as RequestHandler);

export default router;