// src/features/users/services/auth.service.ts
import admin from '../../../config/firebase';
import { findByEmailUser } from '../repositories/user.repository';
import { findByEmailAdmin} from '../repositories/admin.repository';
import { UnauthorizedError, ConflictError, InternalServerError } from '../../../utils/errors/api-error';
import { JwtService } from './jwt.service';

export const loginUserService = async (firebaseToken: string) => {
  try {
    console.log('Firebase token:', firebaseToken);
    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken).catch(() => {
      console.log(decoded);
      throw new UnauthorizedError('Invalid or missing Firebase token');
    });

    const email = decoded.email;

    if (!email) {
      throw new UnauthorizedError('No email found in token');
    }

    // Search user in the database
    // const existingUser  = await findByEmailUser(email);

    // if (!existingUser) {
    //   throw new UnauthorizedError('User is not registered');
    // }

    // Uncomment this if you want to check if the user is active
    // if (!user.is_active) {
    //   throw new UnauthorizedError('User is not active');
    // }
    
    console.log('Successful verification. User:', decoded.uid, 'Email:', email);

    // Generate JWT token
    // const jwtService = new JwtService();
    // const token = jwtService.generateToken({
    //   uid: decoded.uid,
    //   email: email
    // });
    // For testing purposes, we are returning a static token
    const token = 'token de prueba'

    return {
      message: 'Login successful',
      access_token: token
    };
  } catch (error) {
    console.error('Error in loginUserService:', error);
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new InternalServerError('Failed to log in user');
  }
};

export const loginAdminService = async (firebaseToken: string) => {
  try {
    console.log('Firebase token:', firebaseToken);
    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken).catch(() => {
      console.log(decoded);
      throw new UnauthorizedError('Invalid or missing Firebase token');
    });

    const email = decoded.email;

    if (!email) {
      throw new UnauthorizedError('No email found in token');
    }

    // Search user in the database
    // const existingAdmin  = await findByEmailAdmin(email);

    // if (!existingAdmin) {
    //   throw new UnauthorizedError('Admin is not registered');
    // }

    // Uncomment this if you want to check if the Admin is active
    // if (!existingAdmin.is_active) {
    //   throw new UnauthorizedError('Admin is not active');
    // }
    
    console.log('Successful verification. Admin:', decoded.uid, 'Email:', email);

    // Generate JWT token
    const jwtService = new JwtService();
    const token = jwtService.generateToken({
      uid: decoded.uid,
      email: email
    });
    // For testing purposes, we are returning a static token
    // const token = 'token de prueba'
    return {
      message: 'Login successful',
      access_token: token
    };
  } catch (error) {
    console.error('Error in loginAdminService:', error);
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new InternalServerError('Failed to log in Admin');
  }
};