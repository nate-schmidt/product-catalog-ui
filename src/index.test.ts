import { test, expect, beforeAll, afterAll } from "bun:test";
import { server } from "./index";

let baseURL: string;

beforeAll(async () => {
  // The server is started automatically when imported; we just need its URL
  baseURL = `http://localhost:${server.port}`;
});

afterAll(() => {
  server.stop();
});

test("GET /api/hello returns correct JSON and headers", async () => {
  const res = await fetch(`${baseURL}/api/hello`);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("application/json");
  const json = await res.json();
  expect(json).toEqual({ message: "Hello, world!", method: "GET" });
});

test("PUT /api/hello returns correct JSON and headers", async () => {
  const res = await fetch(`${baseURL}/api/hello`, { method: "PUT" });
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("application/json");
  const json = await res.json();
  expect(json).toEqual({ message: "Hello, world!", method: "PUT" });
});

test("GET /api/hello/:name returns personalized greeting and headers", async () => {
  const name = "Alice";
  const res = await fetch(`${baseURL}/api/hello/${name}`);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("application/json");
  const json = await res.json();
  expect(json).toEqual({ message: `Hello, ${name}!` });
});

test("Unknown route returns index.html with correct headers", async () => {
  const res = await fetch(`${baseURL}/non-existent-route`);
  expect(res.status).toBe(200);

  // Should serve HTML
  expect(res.headers.get("content-type")).toContain("text/html");

  const text = await res.text();
  expect(text.toLowerCase()).toContain("<!doctype html>");
});