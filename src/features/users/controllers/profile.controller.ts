// src/features/users/controllers/profile.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.middleware';
import { getUserProfileService } from '../services/getProfile.service';

export const getUserProfileController = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Convertir el request a AuthenticatedRequest para acceder a la propiedad user
    const authReq = req as AuthenticatedRequest;
    const profile = getUserProfileService(authReq );
    res.status(200).json({
      message: 'User profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
