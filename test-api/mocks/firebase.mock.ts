const mockAdmin = {
  auth: jest.fn().mockReturnThis(),
  verifyIdToken: jest.fn(),
  getUser: jest.fn(),
};

export default mockAdmin;