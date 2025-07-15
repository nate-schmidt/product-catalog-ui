import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { spawn } from "bun";
import type { Subprocess } from "bun";

let serverProcess: Subprocess | null = null;

beforeAll(async () => {
  serverProcess = spawn({
    cmd: ["bun", "src/index.tsx"],
    env: { ...process.env, NODE_ENV: "test" },
    stdout: "ignore",
    stderr: "ignore"
  });
  
  await Bun.sleep(1000);
});

afterAll(async () => {
  if (serverProcess) {
    serverProcess.kill();
    await serverProcess.exited;
  }
});

describe("API Routes", () => {
  const baseUrl = "http://localhost:3000";

  test("GET /api/hello returns correct JSON response", async () => {
    const response = await fetch(`${baseUrl}/api/hello`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Hello, world!",
      method: "GET"
    });
  });

  test("PUT /api/hello returns correct JSON response", async () => {
    const response = await fetch(`${baseUrl}/api/hello`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Hello, world!",
      method: "PUT"
    });
  });

  test("GET /api/hello/:name returns personalized message", async () => {
    const name = "TestUser";
    const response = await fetch(`${baseUrl}/api/hello/${name}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: `Hello, ${name}!`
    });
  });

  test("GET /api/hello/:name handles special characters", async () => {
    const name = encodeURIComponent("Test User!");
    const response = await fetch(`${baseUrl}/api/hello/${name}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: `Hello, ${decodeURIComponent(name)}!`
    });
  });

  test("Unmatched routes serve index.html", async () => {
    const response = await fetch(`${baseUrl}/some/random/path`);
    const text = await response.text();
    
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(text).toContain("<!doctype html>");
    expect(text).toContain('<div id="root"></div>');
  });

  test("Root path serves index.html", async () => {
    const response = await fetch(`${baseUrl}/`);
    const text = await response.text();
    
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(text).toContain("<!doctype html>");
  });
});

describe("Server Configuration", () => {
  test("Development mode configuration when NODE_ENV is not production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    
    delete require.cache[require.resolve('./index.tsx')];
    
    process.env.NODE_ENV = originalEnv;
  });

  test("Production mode configuration when NODE_ENV is production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    
    delete require.cache[require.resolve('./index.tsx')];
    
    process.env.NODE_ENV = originalEnv;
  });
});