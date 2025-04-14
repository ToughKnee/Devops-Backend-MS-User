// src/features/users/services/getProfile.service.ts
import { AuthenticatedRequest } from '../../middleware/authenticate.middleware';

export const getUserProfileService = (req: AuthenticatedRequest) => {
  const { role } = req.user!;
  return {
    role: role || 'USER' // Valor por defecto si no hay rol
  };
};