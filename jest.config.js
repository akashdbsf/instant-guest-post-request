const defaultConfig = require('@wordpress/scripts/config/jest-unit.config');

module.exports = {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testMatch: ['**/tests/e2e/**/*.js', '**/tests/components/**/*.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!@bsf/force-ui).+\\.js$'
  ]
};
