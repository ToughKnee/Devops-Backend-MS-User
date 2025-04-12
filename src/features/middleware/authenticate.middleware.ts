// src/middlewares/authenticate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../users/services/jwt.service';
import { UnauthorizedError } from '../../utils/errors/api-error';
import admin from '../../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role?: string;
  };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    // Convertimos el req a AuthenticatedRequest al inyectar la propiedad user
    (req as AuthenticatedRequest).user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role
    };

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
      throw new UnauthorizedError('Firebase token is required');
    }

    await admin.auth()
      .verifyIdToken(firebaseToken)
      .catch(() => {
        throw new UnauthorizedError('Invalid Firebase token');
      });

    next();
  } catch (error) {
    next(error);
  }
};