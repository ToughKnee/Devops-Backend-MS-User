import admin from '../../../config/firebase';
import { RegisterDTO } from '../dto/register.dto';
import { createUser, findByEmailUser } from '../repositories/user.repository';
import { createAdmin, findByEmailAdmin} from '../repositories/admin.repository';
// import { sendVerificationEmail } from '../../../utils/notificationClient';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UnauthorizedError, ConflictError, InternalServerError } from '../../../utils/errors/api-error';

export const registerUserService = async (dto: RegisterDTO, firebaseToken: string) => {
  try {

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken)
      .catch(() => {
        throw new UnauthorizedError('Invalid or missing Firebase token');
      });
    
    // Check if the user is already registered
    const existingUser = await findByEmailUser(decoded.email!);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user in database (is_active = false)
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
    };

    await createUser(user);

    // await sendVerificationEmail(user.email, user.full_name);

    return { message: 'User registered successfully. Please check your email to verify your account.' };

  } catch (error) {
    console.error('Error in registerUser service:', error);
    if (error instanceof UnauthorizedError || error instanceof ConflictError) {
      throw error;
    }
    throw new InternalServerError('Failed to register user');
  }
};

export const registerAdminService = async (dto: RegisterDTO, firebaseToken: string) => {
  try {
    // Verificar token de Firebase
    const decoded = await admin.auth().verifyIdToken(firebaseToken)
      .catch(() => {
        throw new UnauthorizedError('Invalid or missing Firebase token');
      });

    // Verificar si el token tiene rol de admin
    const superAdmin = await findByEmailAdmin(decoded.email!);
    if (!superAdmin) {
      throw new UnauthorizedError('You do not have permission to register an admin user');
    }

    // Verificar si el email ya está registrado
    const existingAdmin = await findByEmailAdmin(dto.email);
    if (existingAdmin) {
      throw new ConflictError('Email already registered as admin');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Crear admin en base de datos
    const adminUser = {
      id: uuidv4(),
      email: dto.email,
      full_name: dto.full_name,
      password_hash: passwordHash,
      is_active: false,
      created_at: new Date(),
      last_login: null
    };

    // Crear usuario en Firebase primero
    await admin.auth().createUser({
      uid: adminUser.id,
      email: adminUser.email,
      password: dto.password,
      displayName: adminUser.full_name,
      emailVerified: false
    }).catch((error) => {
      console.error('Error creating Firebase user:', error);
      throw new InternalServerError('Failed to create Firebase user');
    });

    // Si la creación en Firebase fue exitosa, crear en DB
    await createAdmin(adminUser);

    // Enviar email de verificación (cuando se implemente)
    // await sendVerificationEmail(adminUser.email, adminUser.full_name);

    return { message: 'Admin registered successfully. Please check your email.' };

  } catch (error) {
    console.error('Error in registerAdmin service:', error);
    if (error instanceof UnauthorizedError || error instanceof ConflictError) {
      throw error;
    }
    throw new InternalServerError('Failed to register admin');
  }
};