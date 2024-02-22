module.exports = {
  runner: 'jest-runner-stylelint',
  displayName: 'stylelint',
  moduleFileExtensions: ['css'],
  modulePathIgnorePatterns: ['dist', 'coverage', 'public'],
  testMatch: ['<rootDir>/**/*.css'],
  watchPlugins: ['jest-plugin-filename'],
};
