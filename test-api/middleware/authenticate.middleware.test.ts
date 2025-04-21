import { authenticateJWT, AuthenticatedRequest, validateAuth } from '../../src/features/middleware/authenticate.middleware';
import { JwtService } from '../../src/features/users/services/jwt.service';
import { UnauthorizedError } from '../../src/utils/errors/api-error';
import { Request, Response, NextFunction } from 'express';
import mockAdmin from '../mocks/firebase.mock';

jest.mock('../../src/features/users/services/jwt.service');
jest.mock('../../src/config/firebase', () => mockAdmin);

describe('authenticateJWT Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it('should throw UnauthorizedError if no token is provided', () => {
    authenticateJWT(req as AuthenticatedRequest, res as Response, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError('No token provided'));
  });

  it('should throw UnauthorizedError if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidToken' };
    const jwtServiceMock = JwtService as jest.MockedClass<typeof JwtService>;
    jwtServiceMock.prototype.verifyToken.mockImplementation(() => {
      throw new UnauthorizedError('Invalid or expired JWT');
    });

    authenticateJWT(req as AuthenticatedRequest, res as Response, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError('Invalid or expired JWT'));
  });

  it('should attach user to request if token is valid', () => {
    req.headers = { authorization: 'Bearer validToken' };
    const jwtServiceMock = JwtService as jest.MockedClass<typeof JwtService>;
    jwtServiceMock.prototype.verifyToken.mockReturnValue({ role: 'user' });

    authenticateJWT(req as AuthenticatedRequest, res as Response, next);
    expect(req.user).toEqual({ role: 'user' });
    expect(next).toHaveBeenCalled();
  });
});

describe('validateAuth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() when auth token is valid', async () => {
    mockReq.body = { auth_token: 'valid-token' };
    mockAdmin.verifyIdToken.mockResolvedValueOnce({});

    await validateAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAdmin.verifyIdToken).toHaveBeenCalledWith('valid-token');
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should throw UnauthorizedError when no auth token is provided', async () => {
    await validateAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.any(UnauthorizedError)
    );
    const error = mockNext.mock.calls[0][0] as UnauthorizedError;
    expect(error.message).toBe('Unauthorized');
    expect(error.details).toEqual(['No auth token provided']);
  });

  it('should throw UnauthorizedError when auth token is invalid', async () => {
    mockReq.body = { auth_token: 'invalid-token' };
    mockAdmin.verifyIdToken.mockRejectedValueOnce(new Error('Invalid token'));

    await validateAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAdmin.verifyIdToken).toHaveBeenCalledWith('invalid-token');
    expect(mockNext).toHaveBeenCalledWith(
      expect.any(UnauthorizedError)
    );
    const error = mockNext.mock.calls[0][0] as UnauthorizedError;
    expect(error.message).toBe('Unauthorized');
    expect(error.details).toEqual(['Invalid auth token']);
  });
});