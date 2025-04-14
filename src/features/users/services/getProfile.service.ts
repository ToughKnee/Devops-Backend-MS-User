// src/features/users/services/getProfile.service.ts
import { AuthenticatedRequest } from '../../middleware/authenticate.middleware';

export const getUserProfileService = (req: AuthenticatedRequest) => {
  const { role } = req.user!;
  // Ensure role is either 'user' or 'admin'
  const validRole = role === 'admin' ? 'admin' : 'user';
  return {
    role: validRole
  };
};