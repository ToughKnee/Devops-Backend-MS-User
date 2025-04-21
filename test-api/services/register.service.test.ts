import { registerUserService, registerAdminService } from '../../src/features/users/services/register.service';
import * as userRepository from '../../src/features/users/repositories/user.repository';
import * as adminRepository from '../../src/features/users/repositories/admin.repository';
import { ConflictError, UnauthorizedError } from '../../src/utils/errors/api-error';

// Mock repositories
jest.mock('../../src/features/users/repositories/user.repository');
jest.mock('../../src/features/users/repositories/admin.repository');

describe('Register Services', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUserService', () => {
    const validUserData = {
      email: 'test@ucr.ac.cr',
      full_name: 'Test User',
      auth_id: 'test-auth-id',
      auth_token: 'test-auth-token'
    };

    it('should successfully register a new user', async () => {
      // Mock repository functions
      (userRepository.findByEmailUser as jest.Mock).mockResolvedValue(null);
      (userRepository.createUser as jest.Mock).mockResolvedValue({ id: '1', ...validUserData });

      const result = await registerUserService(validUserData);

      expect(result).toEqual({
        message: 'User registered successfully.'
      });

      expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
        email: validUserData.email,
        full_name: validUserData.full_name
      }));
    });

    it('should throw ConflictError when user email already exists', async () => {
      (userRepository.findByEmailUser as jest.Mock).mockResolvedValue({ id: '1', ...validUserData });

      await expect(registerUserService(validUserData))
        .rejects.toThrow(ConflictError);
    });
  });

  describe('registerAdminService', () => {
    const validAdminData = {
      email: 'admin@ucr.ac.cr',
      full_name: 'Admin User',
      auth_id: 'admin-auth-id',
      auth_token: 'admin-auth-token'
    };

    it('should successfully register a new admin', async () => {
      // Mock repository functions
      (adminRepository.findByEmailAdmin as jest.Mock).mockResolvedValue(null);
      (adminRepository.createAdmin as jest.Mock).mockResolvedValue({ id: '1', ...validAdminData });

      const result = await registerAdminService(validAdminData, 'admin');

      expect(result).toEqual({
        message: 'Admin registered successfully.'
      });

      expect(adminRepository.createAdmin).toHaveBeenCalledWith(expect.objectContaining({
        email: validAdminData.email,
        full_name: validAdminData.full_name
      }));
    });

    it('should throw ConflictError when admin email already exists', async () => {
      (adminRepository.findByEmailAdmin as jest.Mock).mockResolvedValue({ id: '1', ...validAdminData });

      await expect(registerAdminService(validAdminData, 'admin'))
        .rejects.toThrow(ConflictError);
    });

    it('should throw UnauthorizedError when role is not admin', async () => {
      await expect(registerAdminService(validAdminData, 'user'))
        .rejects.toThrow(UnauthorizedError);
      
      expect(adminRepository.createAdmin).not.toHaveBeenCalled();
    });
  });
});