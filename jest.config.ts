import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/booking.spec.ts", // 👈 Exclude playwright files
  ],
  // File patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Module handling
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^next-intl$': '<rootDir>/__mocks__/next-intl.ts',
    '^next/image$': '<rootDir>/__mocks__/next-image.tsx',
    '^next-intl/routing$': '<rootDir>/__mocks__/next-intl/routing.ts',
  },

  // Transform settings
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest', 
      {
        tsconfig: 'tsconfig.jest.json',
      }
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!next-intl)',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',               // All TS/TSX files in any directory
    '!**/*.d.ts',                  // Exclude type declaration files
    '!**/*.stories.tsx',           // Exclude Storybook files
    '!**/index.ts',                // Exclude barrel files
    '!**/node_modules/**',         // Exclude node_modules
    '!**/.next/**',                // Exclude Next.js build files
    '!**/coverage/**',             // Exclude coverage reports
    '!**/__tests__/**',            // Exclude test files
    '!**/jest.config.ts',          // Exclude Jest config
    '!**/next.config.ts',          // Exclude Next.js config 
    '!**/middleware.ts',           // Exclude middleware
    '!**/tailwind.config.ts',      // Exclude Tailwind config
    '!**/vitest.config.ts',        // Exclude Vitest config
    '!**/.storybook/**',           // Exclude Storybook config
    '!**/*.spec.ts',               // Exclude playwright spec files
    '!playwright.config.ts',       // Exclude playwright config
  ],
};

export default config;