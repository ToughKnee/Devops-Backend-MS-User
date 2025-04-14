import { authenticateJWT, AuthenticatedRequest } from '../../src/features/middleware/authenticate.middleware';
import { JwtService } from '../../src/features/users/services/jwt.service';
import { UnauthorizedError } from '../../src/utils/errors/api-error';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../src/features/users/services/jwt.service');

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