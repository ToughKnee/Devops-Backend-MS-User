// Create mock for the database client
const mockClient = {
  query: jest.fn()
};

// Mock the database module
jest.mock('../../src/config/database', () => mockClient);

import { findByEmailAdmin, createAdmin } from '../../src/features/users/repositories/admin.repository';
import { v4 as uuidv4 } from 'uuid';
import { AdminUser } from '../../src/features/users/interfaces/user-entities.interface';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn()
}));

describe('Admin Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmailAdmin', () => {
    it('should find an admin by email', async () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@ucr.ac.cr',
        full_name: 'Admin User',
        is_active: true,
        created_at: new Date(),
        last_login: null
      };

      mockClient.query.mockResolvedValueOnce({
        rows: [mockAdmin],
        rowCount: 1
      });

      const result = await findByEmailAdmin('admin@ucr.ac.cr');
      
      expect(result).toEqual(mockAdmin);
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM admin_users WHERE email = $1',
        ['admin@ucr.ac.cr']
      );
    });

    it('should return null when admin not found', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      });

      const result = await findByEmailAdmin('nonexistent@ucr.ac.cr');
      
      expect(result).toBeNull();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM admin_users WHERE email = $1',
        ['nonexistent@ucr.ac.cr']
      );
    });
  });

  describe('createAdmin', () => {
    it('should create a new admin', async () => {
      const mockUUID = 'mock-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

      const newAdmin: AdminUser = {
        id: mockUUID,
        email: 'new.admin@ucr.ac.cr',
        full_name: 'New Admin',
        is_active: true,
        created_at: new Date(),
        last_login: null
      };

      mockClient.query.mockResolvedValueOnce({
        rows: [newAdmin],
        rowCount: 1
      });

      await createAdmin(newAdmin);
      
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO admin_users'),
        [newAdmin.id, newAdmin.email, newAdmin.full_name, newAdmin.is_active]
      );
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      mockClient.query.mockRejectedValueOnce(mockError);

      const newAdmin: AdminUser = {
        id: 'test-id',
        email: 'new.admin@ucr.ac.cr',
        full_name: 'New Admin',
        is_active: true,
        created_at: new Date(),
        last_login: null
      };

      await expect(createAdmin(newAdmin)).rejects.toThrow('Database error');
    });
  });
});