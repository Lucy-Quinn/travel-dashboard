import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  clearMocks: true,

  coverageProvider: 'v8',

  testEnvironment: 'jsdom',

  collectCoverage: true,

  coverageDirectory: 'coverage',

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],

  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/actions/(.*)$': '<rootDir>/src/app/actions/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/schemas/(.*)$': '<rootDir>/src/schemas/$1',

    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/__mocks__/fileMock.ts',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)', '**/?(*.)+(test|spec).(ts|tsx)'],

  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}

export default createJestConfig(config)
