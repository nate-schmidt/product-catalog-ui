// @ts-ignore bun test import
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import * as bunMod from "bun";

let server: any;

// Capture Bun.serve so we can access the server instance created in index.tsx
const originalServe = bunMod.serve;
(bunMod as any).serve = (...args: any[]) => {
  // Use apply to avoid TypeScript tuple spread complaint
  server = originalServe.apply(null, args as any);
  return server;
};

// Import the server file (this will invoke the patched serve)
await import("./index");

// Ensure we have server
if (!server) throw new Error("Server failed to start during tests");

describe("API routes in index.tsx", () => {
  test("GET /api/hello returns expected JSON", async () => {
    const res = await fetch(new URL("/api/hello", server.url));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: "Hello, world!", method: "GET" });
  });

  test("PUT /api/hello returns expected JSON", async () => {
    const res = await fetch(new URL("/api/hello", server.url), { method: "PUT" });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: "Hello, world!", method: "PUT" });
  });

  test("GET /api/hello/:name returns personalized greeting", async () => {
    const res = await fetch(new URL("/api/hello/Alice", server.url));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: "Hello, Alice!" });
  });
});

afterAll(async () => {
  await server.stop();
  // Restore original serve implementation for subsequent tests (if any)
  (bunMod as any).serve = originalServe;
});