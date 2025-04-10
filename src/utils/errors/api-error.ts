export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', details?: any) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details?: any) {
    super(401, message, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', details?: any) {
    super(403, message, details);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict', details?: any) {
    super(409, message, details);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', details?: any) {
    super(500, message, details);
  }
}