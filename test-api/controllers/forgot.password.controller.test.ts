import { sendRecoveryLink } from '../../src/features/users/controllers/forgot.password.controller';
import { generatePasswordResetLink } from '../../src/features/users/services/forgot.password.service';

jest.mock('../../src/features/users/services/forgot.password.service');
const mockGeneratePasswordResetLink = generatePasswordResetLink as jest.Mock;

describe('Forgot Password Controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 200 and success message when email is valid', async () => {
    const message = 'Recovery email sent to user@example.com';
    req.body.email = 'user@example.com';
    mockGeneratePasswordResetLink.mockResolvedValueOnce(message);

    await sendRecoveryLink(req, res);

    expect(mockGeneratePasswordResetLink).toHaveBeenCalledWith('user@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message });
  });

  it('should return 400 if email is invalid', async () => {
    req.body.email = 'not-an-email';

    await sendRecoveryLink(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  it('should return 500 and error message on failure', async () => {
    const error = new Error('Something went wrong');
    req.body.email = 'user@example.com';
    mockGeneratePasswordResetLink.mockRejectedValueOnce(error);

    await sendRecoveryLink(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Could not send recovery email' });
  });
});
