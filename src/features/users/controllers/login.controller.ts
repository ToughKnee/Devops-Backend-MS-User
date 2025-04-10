// src/features/users/controllers/login.controller.ts
import { Request, Response } from 'express';
import { loginUserService } from '../services/login.service';

export const loginUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate there is a token
    const token = req.headers.authorization?.split('Bearer ')[1] || '';
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });
    }
    
    // Validate the token with user service
    const result = await loginUserService(token);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in LoginUserController: ', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};
