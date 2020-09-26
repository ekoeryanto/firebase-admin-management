/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

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
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: "<rootDir>/" } ),
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/tests/**/*.(test|spec).(ts|js)"
  ],
  testEnvironment: "node"
};
