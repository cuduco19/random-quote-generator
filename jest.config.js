module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': '<rootDir>/esbuild-transformer.js',
  },
};
