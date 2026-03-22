module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  moduleNameMapper: {
    "\\.(css|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!(firebase|@firebase)/)"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
};
