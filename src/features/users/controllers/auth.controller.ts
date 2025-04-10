// src/features/users/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../services/auth.service';

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const idToken = req.body.idToken;

  if (!idToken) {
    console.error('ID token es requerido');
    return res.status(400).json({ message: 'ID token es requerido' });
  }

  try {
    const decoded = await verifyFirebaseToken(idToken);
    console.error('ID token es requerido');
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error al verificar el token:', errorMessage);
    res.status(401).json({ message: errorMessage });
  }
};
