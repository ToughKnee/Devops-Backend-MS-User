import { Request, Response, NextFunction } from 'express';
import { findByEmailUser, updateUserActiveStatus } from '../repositories/user.repository';
import { findByEmailAdmin, updateAdminActiveStatus } from '../repositories/admin.repository';
import { BadRequestError } from '../../../utils/errors/api-error';

export const userEmailVerificationWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verified } = req.body;

    if (!email || typeof verified !== 'boolean') {
      throw new BadRequestError(
        'El payload del webhook es inválido. Se esperaba: { email, verified: boolean }'
      );
    }

    const user = await findByEmailUser(email);
    if (!user) {
      throw new BadRequestError('No se encontró el usuario especificado');
    }

    await updateUserActiveStatus(email, verified);
    res.status(200).json({
      status: 'success',
      message: 'Usuario verificado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

export const adminEmailVerificationWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verified } = req.body;

    if (!email || typeof verified !== 'boolean') {
      throw new BadRequestError(
        'El payload del webhook es inválido. Se esperaba: { email, verified: boolean }'
      );
    }

    const admin = await findByEmailAdmin(email);
    if (!admin) {
      throw new BadRequestError('No se encontró el administrador especificado');
    }

    await updateAdminActiveStatus(email, verified);
    res.status(200).json({
      status: 'success',
      message: 'Administrador verificado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};