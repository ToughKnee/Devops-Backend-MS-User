// src/middlewares/authenticate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../users/services/jwt.service';
import { UnauthorizedError } from '../../utils/errors/api-error';

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    role: string;
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