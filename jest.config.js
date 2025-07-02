const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["<rootDir>/test"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/test/**/*.test.ts"],
  collectCoverageFrom: ["./src/**/*.ts"]
};