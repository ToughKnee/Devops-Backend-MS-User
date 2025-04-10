// src/features/users/services/auth.service.ts
import admin from '../../../config/firebase';
import { findByEmailUser } from '../repositories/user.repository';

export const loginUserService = async (firebaseToken: string) => {
  try {
    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    if (!decoded || !decoded.email) {
      throw new Error('Valid token but has no email');
    }

    // Search user in the database
    const existingUser  = await findByEmailUser(decoded.email);

    if (!existingUser) {
      throw new Error('The user is not registered in the system.');
    }
    
    console.log('✅ Verificación exitosa. Usuario:', decoded.uid);
    return {
      uid: decoded.uid,
      email: decoded.email,
      full_name: existingUser.full_name,
      profile_picture: existingUser.profile_picture,
      role: existingUser.role,
      message: 'Login exitoso'
    };

  } catch (error) {
    console.error('❌ Error en loginUserService:', error);
    throw new Error('Token inválido o expirado: ' + error);
  }
};