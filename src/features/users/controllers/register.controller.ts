import { Request, Response } from 'express';
import { registerUserService, registerAdminService } from '../services/register.service';
import { registerSchema } from '../dto/register.dto';

export const registerUserController = async (req: Request, res: Response) => {
  try {
    await registerSchema.validate(req.body);
    const token = req.headers.authorization?.split('Bearer ')[1] || '';
    const result = await registerUserService(req.body, token);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const registerAdminController = async (req: Request, res: Response) => {
  try {
    await registerSchema.validate(req.body);
    const token = req.headers.authorization?.split('Bearer ')[1] || '';
    const result = await registerAdminService(req.body, token);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};