import { Request, Response, NextFunction } from 'express';
import admin from '../../firebase/firebase-admin';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o malformado' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Agregamos el usuario al objeto req
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
