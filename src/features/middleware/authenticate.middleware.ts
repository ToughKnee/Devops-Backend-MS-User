// src/middlewares/authenticate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../users/services/jwt.service';
import { UnauthorizedError } from '../../utils/errors/api-error';
import admin from '../../config/firebase';

export interface AuthenticatedRequest extends Request {
  user: {
    role: string;
  };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    if (!authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new UnauthorizedError('Invalid token format');
    }

    const token = authHeader.split('Bearer ')[1];

    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    // Add all decoded token fields to the user property
    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};


export const validateAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Validate Firebase token from body
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
      throw new UnauthorizedError('Unauthorized');
    }

    await admin.auth()
      .verifyIdToken(firebaseToken)
      .catch(() => {
        throw new UnauthorizedError('Unauthorized');
      });

    next();
  } catch (error) {
    next(error);
  }
};