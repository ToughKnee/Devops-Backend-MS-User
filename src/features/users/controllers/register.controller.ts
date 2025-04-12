import { Request, Response, NextFunction } from 'express';
import { registerUserService, registerAdminService } from '../services/register.service';
import * as yup from 'yup';
import { registerSchema, RegisterDTO } from '../dto/register.dto';
import { BadRequestError } from '../../../utils/errors/api-error';
import { AuthenticatedRequest } from '../../../features/middleware/authenticate.middleware';
export const registerUserController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Validate and cast the request body to RegisterDTO
    const validatedData = await registerSchema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    }) as RegisterDTO;

    const result = await registerUserService(validatedData);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      next(new BadRequestError('Validation error', error.errors));
    } else {
      next(error);
    }
  }
};

export const registerAdminController = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Validate and cast the request body to RegisterDTO
    const validatedData = await registerSchema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    }) as RegisterDTO;

    if (!req.user || !req.user.role) {
      return next(new BadRequestError('User role is missing or undefined'));
    }
    const result = await registerAdminService(validatedData, req.user.role);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      next(new BadRequestError('Validation error', error.errors));
    } else {
      next(error);
    }
  }
};