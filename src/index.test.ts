import { test, expect, afterAll } from "bun:test";
import { server } from "./index";

const baseURL = `http://localhost:${server.port}`;

afterAll(() => {
  server.stop();
});

test("GET /api/hello returns correct JSON", async () => {
  const res = await fetch(`${baseURL}/api/hello`);
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ message: "Hello, world!", method: "GET" });
});

test("PUT /api/hello returns correct JSON", async () => {
  const res = await fetch(`${baseURL}/api/hello`, { method: "PUT" });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ message: "Hello, world!", method: "PUT" });
});

test("GET /api/hello/:name returns personalized greeting", async () => {
  const name = "Alice";
  const res = await fetch(`${baseURL}/api/hello/${name}`);
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ message: `Hello, ${name}!` });
});