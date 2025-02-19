import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock sequelize
jest.mock('@/models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(null),
    close: jest.fn().mockResolvedValue(null),
  }
}));
