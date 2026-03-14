module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/out/$1',
  }
};
