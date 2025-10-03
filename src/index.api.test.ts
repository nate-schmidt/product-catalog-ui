import { describe, test, expect } from "bun:test";
import { apiRoutes } from "./index";

// Helper to read JSON from a Response in Bun tests
async function readJson(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

describe("apiRoutes", () => {
  test("GET /api/hello returns hello with method GET", async () => {
    const handler = (apiRoutes["/api/hello"] as any).GET as (req: any) => Promise<Response>;
    const res = await handler({});
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual({ message: "Hello, world!", method: "GET" });
  });

  test("PUT /api/hello returns hello with method PUT", async () => {
    const handler = (apiRoutes["/api/hello"] as any).PUT as (req: any) => Promise<Response>;
    const res = await handler({});
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual({ message: "Hello, world!", method: "PUT" });
  });

  test("/api/hello/:name responds with personalized message", async () => {
    const handler = apiRoutes["/api/hello/:name"] as (req: any) => Promise<Response>;
    const res = await handler({ params: { name: "Ada" } });
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual({ message: "Hello, Ada!" });
  });
});

