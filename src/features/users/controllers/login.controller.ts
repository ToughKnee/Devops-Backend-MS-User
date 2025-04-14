// src/features/users/controllers/login.controller.ts
import { Request, Response, NextFunction } from 'express';
import { loginUserService, loginAdminService } from '../services/login.service';
import { UnauthorizedError } from '../../../utils/errors/api-error';

export const loginUserController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Validate there is a token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Validate the token with user service
    const result = await loginUserService(token);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in LoginUserController: ', error);
    next(error);
  }
};

export const loginAdminController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Validate there is a token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Validate the token with admin service
    const result = await loginAdminService(token);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in LoginAdminController: ', error);
    next(error);
  }
};
