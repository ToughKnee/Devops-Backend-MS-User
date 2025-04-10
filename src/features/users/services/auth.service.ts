// src/features/users/services/auth.service.ts
import admin from '../../../firebase/firebase-admin';

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Verificación exitosa. Usuario:', decodedToken.uid);
    return decodedToken; // uid, email, etc.
  } catch (error) {
    throw new Error('Token inválido o expirado: ' + error);
  }
};