import admin from '../../../config/firebase';
import { RegisterDTO } from '../dto/register.dto';
import { createUser, findByEmailUser } from '../repositories/user.repository';
import { createAdmin, findByEmailAdmin} from '../repositories/admin.repository';
// import { sendVerificationEmail } from '../../../utils/notificationClient';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const registerUserService = async (dto: RegisterDTO, firebaseToken: string) => {
  try {
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const existingUser = await findByEmailUser(decoded.email!);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = {
      id: uuidv4(),
      email: decoded.email!,
      full_name: dto.full_name,
      password_hash: passwordHash,
      username: dto.email.split('@')[0],
      profile_picture: 'https://example.com/default-profile.png',
      is_active: false,
      created_at: new Date(),
      last_login: null,
      role: 'USER'
    };

    await createUser(user);
    // await sendVerificationEmail(user.email, user.full_name);

    // return { message: 'User registered successfully. Please check your email to verify your account.' };

  } catch (error) {
    console.error('Error in registerUser service:', error);
    throw new Error('Failed to register user.');
  }
};

export const registerAdminService = async (dto: RegisterDTO, adminToken: string) => {
  try {
    const decoded = await admin.auth().verifyIdToken(adminToken);

    if (!decoded || !decoded.admin) {
      throw new Error('Unauthorized: Only admins can create other admins.');
    }
     const existingAdmin = await findByEmailAdmin(dto.email);
    if (existingAdmin) {
      throw new Error('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const adminUser = {
      id: uuidv4(),
      email: dto.email,
      full_name: dto.full_name,
      password_hash: passwordHash,
      is_active: false,
      created_at: new Date(),
      last_login: null
    };

    await createAdmin(adminUser);
    // await sendVerificationEmail(adminUser.email, adminUser.full_name);

    // return { message: 'Admin registered successfully. Please check your email.' };

  } catch (error) {
    console.error('Error in registerAdmin service:', error);
    throw new Error('Failed to register admin.');
  }
};
