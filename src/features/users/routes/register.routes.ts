import { Router } from 'express';
import { registerUserController, registerAdminController } from '../controllers/register.controller';
import { userEmailVerificationWebhook, adminEmailVerificationWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/auth/register', registerUserController);
router.post('/admin/auth/register', registerAdminController);

router.post('/webhook/user/email-verification', userEmailVerificationWebhook);
router.post('/webhook/admin/email-verification', adminEmailVerificationWebhook);

export default router;