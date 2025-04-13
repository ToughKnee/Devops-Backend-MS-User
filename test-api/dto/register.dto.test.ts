import { registerSchema } from '../../src/features/users/dto/register.dto';

describe('Register Schema Validation', () => {
  it('should validate a correct user registration data', async () => {
    const validData = {
      email: 'test.user@ucr.ac.cr',
      full_name: 'Test User',
      auth_id: 'test-auth-id',
      auth_token: 'test-auth-token'
    };

    await expect(registerSchema.validate(validData)).resolves.toEqual(validData);
  });

  it('should reject non-UCR email', async () => {
    const invalidData = {
      email: 'test@gmail.com',
      full_name: 'Test User',
      auth_id: 'test-auth-id',
      auth_token: 'test-auth-token'
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow(
      'El correo debe ser institucional de la UCR'
    );
  });

  it('should reject invalid full name', async () => {
    const invalidData = {
      email: 'test@ucr.ac.cr',
      full_name: 'T', // Too short
      auth_id: 'test-auth-id',
      auth_token: 'test-auth-token'
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow(
      'El nombre completo debe tener al menos 3 caracteres'
    );
  });

  it('should reject missing auth_id', async () => {
    const invalidData = {
      email: 'test@ucr.ac.cr',
      full_name: 'Test User',
      auth_token: 'test-auth-token'
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow(
      'El auth_id es obligatorio'
    );
  });

  it('should reject missing auth_token', async () => {
    const invalidData = {
      email: 'test@ucr.ac.cr',
      full_name: 'Test User',
      auth_id: 'test-auth-id'
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow(
      'El auth_token es obligatorio'
    );
  });

  it('should reject if auth_id is empty', async () => {
    const invalidData = {
      email: 'test@ucr.ac.cr',
      full_name: 'Test User',
      auth_id: '',
      auth_token: 'test-auth-token'
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject if auth_token is empty', async () => {
    const invalidData = {
      email: 'test@ucr.ac.cr',
      full_name: 'Test User',
      auth_id: 'test-auth-id',
      auth_token: ''
    };

    await expect(registerSchema.validate(invalidData)).rejects.toThrow();
  });
});