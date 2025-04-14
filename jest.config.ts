import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src', '<rootDir>/test-api'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/types/**/*',
    '!src/**/*.d.ts',
    '!src/test-db/**/*',
    '!src/app.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/test-api/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: ['dotenv/config'],
  testEnvironmentOptions: {
    env: {
      NODE_ENV: 'test'
    }
  },
  detectOpenHandles: false,
  forceExit: false
};

export default config;