module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  setupFiles: ["dotenv/config"],
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/tests/**/*.(test|spec).(ts|js)"
  ],
  testEnvironment: "node"
};
