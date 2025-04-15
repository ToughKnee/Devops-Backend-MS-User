import request from 'supertest';
import express, { ErrorRequestHandler } from 'express';
import systemRoutes from '../../src/features/system/routes/system.routes';
import { errorHandler } from '../../src/utils/errors/error-handler.middleware';
import client from '../../src/config/database';

// Mock the database client
jest.mock('../../src/config/database', () => ({
  query: jest.fn()
}));

describe('System Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', systemRoutes);
    app.use(errorHandler as ErrorRequestHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and success message when database is connected', async () => {
      // Mock successful database query
      (client.query as jest.Mock).mockResolvedValueOnce({});

      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Server is running and database connection is active',
        database: {
          connected: true
        }
      });

      // Verify timestamp is present and is a valid date
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
      
      // Verify database host is included
      expect(response.body.database.host).toBeDefined();
    });

    it('should return 500 when database connection fails', async () => {
      // Mock failed database query
      const mockError = new Error('Database connection failed');
      (client.query as jest.Mock).mockRejectedValueOnce(mockError);

      const response = await request(app)
        .get('/health')
        .expect(500);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Server is running but database connection failed',
        database: {
          connected: false,
          error: 'Database connection failed'
        }
      });

      // Verify timestamp is present and is a valid date
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });
});