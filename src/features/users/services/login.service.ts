// src/features/users/services/auth.service.ts
import admin from '../../../config/firebase';
import { findByEmailUser } from '../repositories/user.repository';
import { UnauthorizedError, ConflictError, InternalServerError } from '../../../utils/errors/api-error';

export const loginUserService = async (firebaseToken: string) => {
  try {
    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken).catch(() => {
      throw new UnauthorizedError('Invalid or missing Firebase token');
    });

    const email = decoded.email;

    if (!email) {
      throw new UnauthorizedError('No email found in token');
    }

    // Search user in the database
    const existingUser  = await findByEmailUser(email);

    if (!existingUser) {
      throw new UnauthorizedError('User is not registered');
    }

    // Uncomment this if you want to check if the user is active
    // if (!user.is_active) {
    //   throw new UnauthorizedError('User is not active');
    // }
    
    console.log('Successfull verification. User:', decoded.uid, 'Email:', email);
    return {
      message: 'Login exitoso',
      user: {
        email: existingUser.email,
        full_name: existingUser.full_name,
        username: existingUser.username
      }
    };
  } catch (error) {
    console.error('Error in loginUserService:', error);
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new InternalServerError('Failed to log in user');
  }
};