import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";

// Simple static-file assertions help improve coverage of the UI's entry HTML.

describe("index.html", () => {
  const html = readFileSync("./src/index.html", "utf8");

  test("contains the root div", () => {
    expect(html).toContain('<div id="root"></div>');
  });

  test("imports the frontend entry script", () => {
    expect(html).toMatch(/<script[^>]*src="\.\/frontend\.tsx"/);
  });
});