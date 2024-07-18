module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  resetModules: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx,js,jsx}", "!**/*.d.ts"],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
