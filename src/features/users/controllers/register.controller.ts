import { Request, Response, NextFunction } from 'express';
import { registerUserService, registerAdminService } from '../services/register.service';
import { registerSchema } from '../dto/register.dto';
import { BadRequestError, UnauthorizedError } from '../../../utils/errors/api-error';

export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    await registerSchema.validate(req.body).catch((err) => {
      throw new BadRequestError('Validation error', err.errors);
    });

    // Get and validate token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const result = await registerUserService(req.body, authHeader.split('Bearer ')[1]);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const registerAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    await registerSchema.validate(req.body).catch((err) => {
      throw new BadRequestError('Validation error', err.errors);
    });

    // Get and validate token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const result = await registerAdminService(req.body, authHeader.split('Bearer ')[1]);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};