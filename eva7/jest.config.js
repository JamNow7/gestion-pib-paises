export default {
  // Habilitar soporte ES Modules
  preset: undefined,

  // Extensiones
  moduleFileExtensions: ['js', 'mjs'],

  // No transformar (usar ES Modules nativo)
  transform: {},

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test files
  testMatch: ['**/tests/**/*.test.js'],

  // Coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],

  // Ignore
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['node_modules'],

  // Timeout
  testTimeout: 60000,

  // Force exit after tests (fixes hanging connections)
  forceExit: true,

  // Detect open handles/fds
  detectOpenHandles: true,

  // Environment
  testEnvironment: 'node'
};
