import { describe, test, expect, afterAll } from "bun:test";
import server from "./index.tsx";


describe("API Routes", () => {
  test("GET /api/hello should respond with Hello, world! and method GET", async () => {
    const res = await server.fetch("/api/hello");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ message: "Hello, world!", method: "GET" });
  });

  test("PUT /api/hello should respond with Hello, world! and method PUT", async () => {
    const req = new Request("/api/hello", { method: "PUT" });
    const res = await server.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ message: "Hello, world!", method: "PUT" });
  });

  test("GET /api/hello/:name should greet the provided name", async () => {
    const name = "Alice";
    const res = await server.fetch(`/api/hello/${name}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ message: `Hello, ${name}!` });
  });
});

// Gracefully shut down the server after all tests finish to free resources
afterAll(async () => {
  await server.stop();
});