import { Request, Response, NextFunction } from 'express';
import { ApiError } from './api-error';
import { ValidationError } from 'yup';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Handle Yup validation errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 400,
      message: 'Validation Error',
      details: error.errors
    });
  }

  // Handle our custom API errors
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      details: error.details
    });
  }

  // Handle Firebase auth errors
  if (error.name === 'FirebaseAuthError') {
    return res.status(401).json({
      status: 401,
      message: 'Invalid or missing Firebase token',
      details: error.message
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};