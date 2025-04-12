import admin from '../../../config/firebase';
import { RegisterDTO } from '../dto/register.dto';
import { createUser, findByEmailUser } from '../repositories/user.repository';
import { createAdmin, findByEmailAdmin} from '../repositories/admin.repository';
// import { sendVerificationEmail } from '../../../utils/notificationClient';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedError, ConflictError, InternalServerError } from '../../../utils/errors/api-error';

const DEFAULT_PROFILE_PICTURE = 'https://storage.googleapis.com/your-bucket/default-avatar.png';  // Update with your actual default image URL

export const registerUserService = async (dto: RegisterDTO) => {
  try {
    // Check if the user is already registered
    const existingUser = await findByEmailUser(dto.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user in database
    const user = {
      id: uuidv4(),
      email: dto.email,
      full_name: dto.full_name,
      username: dto.email.split('@')[0],
      profile_picture: dto.profile_picture || DEFAULT_PROFILE_PICTURE,
      is_active: true, // Set to true for now, can be changed later
      created_at: new Date(),
      last_login: null,
    };
    
    // crear en DB
    await createUser(user);

    return { message: 'User registered successfully.' };

  } catch (error) {
    console.error('Error in registerUser service:', error);
    if (error instanceof UnauthorizedError || error instanceof ConflictError) {
      throw error;
    }
    throw new InternalServerError('Failed to register user');
  }
};

export const registerAdminService = async (dto: RegisterDTO, role: string) => {
  try {
    if (role !== 'admin') {
      throw new UnauthorizedError('Unauthorized action');
    }
    // Verificar si el email ya está registrado
    const existingAdmin = await findByEmailAdmin(dto.email);
    if (existingAdmin) {
      throw new ConflictError('Email already registered as admin');
    }

    // Crear admin en base de datos
    const adminUser = {
      id: uuidv4(),
      email: dto.email,
      full_name: dto.full_name,
      is_active: true,
      created_at: new Date(),
      last_login: null
    };

    // crear en DB
    await createAdmin(adminUser);

    return { message: 'Admin registered successfully.' };

  } catch (error) {
    console.error('Error in registerAdmin service:', error);
    if (error instanceof UnauthorizedError || error instanceof ConflictError) {
      throw error;
    }
    throw new InternalServerError('Failed to register admin');
  }
};