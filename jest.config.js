/** @type {import('jest').Config} */
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  
  // Module name mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@integrations/(.*)$': '<rootDir>/src/integrations/$1'
  },
  
  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Files to ignore during transformation
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@supabase|@tanstack|recharts|lucide-react|date-fns))'
  ],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/test/**/*.test.{ts,tsx}',
    '<rootDir>/src/test/**/*.spec.{ts,tsx}'
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.config.{ts,tsx}'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Handle static assets
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/test/__mocks__/fileMock.js'
  },
  
  // Global setup and teardown
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  globalTeardown: '<rootDir>/src/test/globalTeardown.ts',
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error on deprecated features
  errorOnDeprecated: true,
  
  // Notify mode
  notify: false,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml'
      }
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results',
        filename: 'report.html',
        expand: true
      }
    ]
  ],
  
  // Max workers for parallel execution
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/node_modules/.cache/jest'
};