// @ts-ignore - Bun's test runner provides this module at runtime
import { describe, test, expect, beforeAll, afterAll } from "bun:test";

import { toCamelCase, parseValue, parseArgs, formatFileSize } from "./build";

// Declare a minimal `process` typing so TypeScript doesn't complain in the test environment.
declare var process: { argv: string[] };
// eslint-disable-next-line @typescript-eslint/no-redeclare
// @ts-ignore -- Bun injects a compatible `process` object at runtime
// The redeclaration above is only for type checking purposes.


describe("toCamelCase", () => {
  const cases: Array<[string, string]> = [
    ["hello-world", "helloWorld"],
    ["very-long-test-case", "veryLongTestCase"],
    ["alreadyCamel", "alreadyCamel"],
  ];

  cases.forEach(([input, expected]) => {
    test(`converts ${input} -> ${expected}`, () => {
      expect(toCamelCase(input)).toBe(expected);
    });
  });
});

describe("parseValue", () => {
  const cases: Array<[string, unknown]> = [
    ["true", true],
    ["false", false],
    ["42", 42],
    ["3.14", 3.14],
    ["a,b,c", ["a", "b", "c"]],
    ["hello", "hello"],
  ];

  cases.forEach(([input, expected]) => {
    test(`parses \"${input}\" correctly`, () => {
      expect(parseValue(input)).toEqual(expected);
    });
  });
});

describe("formatFileSize", () => {
  const cases: Array<[number, string]> = [
    [500, "B"],
    [2048, "KB"],
    [5 * 1024 * 1024, "MB"],
  ];

  cases.forEach(([bytes, unit]) => {
    test(`formats ${bytes} bytes to include ${unit}`, () => {
      expect(formatFileSize(bytes)).toContain(unit);
    });
  });
});

describe("parseArgs", () => {
  const originalArgv = process.argv;

  beforeAll(() => {
    process.argv = [
      "bun",
      "build.ts",
      "--outdir",
      "dist",
      "--minify",
      "--no-splitting",
      "--define.VERSION=1.0.0",
      "--minify.whitespace=true",
    ];
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  test("parses CLI arguments into correct config object", () => {
    const config = parseArgs();
    expect(config.outdir).toBe("dist");
    expect(config.minify).toBe(true);
    expect(config.splitting).toBe(false);
    expect((config as any).minify).toBeDefined();
    expect((config as any).minify.whitespace).toBe(true);
    expect(config.define).toEqual({ VERSION: "1.0.0" });
  });
});