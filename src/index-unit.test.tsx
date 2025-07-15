import { test, expect, describe, mock } from "bun:test";

describe("index.tsx server configuration", () => {
  test("server is configured with correct routes", async () => {
    const mockServe = mock((config: any) => {
      expect(config.routes).toBeDefined();
      expect(config.routes["/*"]).toBeDefined();
      expect(config.routes["/api/hello"]).toBeDefined();
      expect(config.routes["/api/hello/:name"]).toBeDefined();
      
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    expect(mockServe).toHaveBeenCalled();

    (Bun as any).serve = originalServe;
  });

  test("GET /api/hello route handler returns correct response", async () => {
    let capturedRoutes: any;
    const mockServe = mock((config: any) => {
      capturedRoutes = config.routes;
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    const response = await capturedRoutes["/api/hello"].GET({});
    const data = await response.json();

    expect(data).toEqual({
      message: "Hello, world!",
      method: "GET"
    });

    (Bun as any).serve = originalServe;
  });

  test("PUT /api/hello route handler returns correct response", async () => {
    let capturedRoutes: any;
    const mockServe = mock((config: any) => {
      capturedRoutes = config.routes;
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    const response = await capturedRoutes["/api/hello"].PUT({});
    const data = await response.json();

    expect(data).toEqual({
      message: "Hello, world!",
      method: "PUT"
    });

    (Bun as any).serve = originalServe;
  });

  test("/api/hello/:name route handler returns personalized message", async () => {
    let capturedRoutes: any;
    const mockServe = mock((config: any) => {
      capturedRoutes = config.routes;
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    const mockRequest = { params: { name: "TestUser" } };
    const response = await capturedRoutes["/api/hello/:name"](mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: "Hello, TestUser!"
    });

    (Bun as any).serve = originalServe;
  });

  test("development configuration is set when NODE_ENV is not production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    let capturedConfig: any;
    const mockServe = mock((config: any) => {
      capturedConfig = config;
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    expect(capturedConfig.development).toBeTruthy();
    expect(capturedConfig.development.hmr).toBe(true);
    expect(capturedConfig.development.console).toBe(true);

    (Bun as any).serve = originalServe;
    process.env.NODE_ENV = originalEnv;
  });

  test("development configuration is false when NODE_ENV is production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    let capturedConfig: any;
    const mockServe = mock((config: any) => {
      capturedConfig = config;
      return { port: 3000 };
    });

    const originalServe = Bun.serve;
    (Bun as any).serve = mockServe;

    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');

    expect(capturedConfig.development).toBe(false);

    (Bun as any).serve = originalServe;
    process.env.NODE_ENV = originalEnv;
  });
});