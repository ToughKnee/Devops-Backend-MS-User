// src/features/users/services/jwt.service.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError } from '../../../utils/errors/api-error';

dotenv.config();

interface Payload {
  uid: string;
  email: string;
  role: string;
}

export class JwtService {
  private readonly secret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    this.secret = process.env.JWT_SECRET;
  }

  public generateToken(payload: Payload): string {
    return jwt.sign(payload, this.secret as string, { expiresIn: "1h" });
  }

  public verifyToken(token: string): Payload {
    try {
      return jwt.verify(token, this.secret) as Payload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired JWT');
    }
  }
}