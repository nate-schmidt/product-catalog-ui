// @ts-ignore bun test import
import { describe, test, expect } from "bun:test";
import { toCamelCase, parseArgs, formatFileSize } from "./build";

describe("parseArgs edge cases", () => {
  test("handles --no-* flags correctly", () => {
    const original = process.argv;
    process.argv = ["bun", "build.ts", "--no-splitting", "--define.DEBUG=false"];

    const config = parseArgs();
    expect(config.splitting).toBe(false);
    // nested property when only object passed via equals sign should work
    expect((config as any).define).toEqual({ DEBUG: false });

    process.argv = original;
  });

  test("handles key value separated by space", () => {
    const original = process.argv;
    process.argv = [
      "bun",
      "build.ts",
      "--outdir",
      "public",
      "--target",
      "browser",
    ];

    const config = parseArgs();
    expect(config.outdir).toBe("public");
    expect(config.target).toBe("browser");

    process.argv = original;
  });
});

describe("toCamelCase edge cases", () => {
  test("returns same string if no hyphen present", () => {
    expect(toCamelCase("helloWorld")).toBe("helloWorld");
  });
});

describe("formatFileSize edge cases", () => {
  test("handles values larger than GB", () => {
    const terabyte = 1024 ** 4; // 1TB
    const formatted = formatFileSize(terabyte);
    // Should cap at GB unit
    expect(formatted).toContain("GB");
  });
});