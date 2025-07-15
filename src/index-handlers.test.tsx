import { test, expect, describe, mock } from "bun:test";

describe("index.tsx route handlers direct testing", () => {
  test("all route handlers work correctly", async () => {
    let capturedConfig: any;
    
    // Mock Bun.serve to capture the config
    const mockServe = mock((config: any) => {
      capturedConfig = config;
      return { port: 3000, hostname: "localhost" };
    });
    
    const originalServe = (Bun as any).serve;
    (Bun as any).serve = mockServe;
    
    // Set NODE_ENV to test development config
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    
    // Clear cache and import
    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');
    
    expect(mockServe).toHaveBeenCalled();
    
    // Test the route handlers directly
    const routes = capturedConfig.routes;
    
    // Test GET /api/hello
    const getHelloResponse = await routes["/api/hello"].GET({});
    const getHelloData = await getHelloResponse.json();
    expect(getHelloData).toEqual({
      message: "Hello, world!",
      method: "GET"
    });
    
    // Test PUT /api/hello  
    const putHelloResponse = await routes["/api/hello"].PUT({});
    const putHelloData = await putHelloResponse.json();
    expect(putHelloData).toEqual({
      message: "Hello, world!",
      method: "PUT"
    });
    
    // Test /api/hello/:name
    const nameResponse = await routes["/api/hello/:name"]({ 
      params: { name: "TestUser" } 
    });
    const nameData = await nameResponse.json();
    expect(nameData).toEqual({
      message: "Hello, TestUser!"
    });
    
    // Test development config
    expect(capturedConfig.development).toBeTruthy();
    expect(capturedConfig.development.hmr).toBe(true);
    expect(capturedConfig.development.console).toBe(true);
    
    // Test production config
    process.env.NODE_ENV = "production";
    delete require.cache[require.resolve('./index.tsx')];
    await import('./index.tsx');
    
    // Get the new config from the second call
    const productionConfig = mockServe.mock.calls[1][0];
    expect(productionConfig.development).toBe(false);
    
    // Restore
    (Bun as any).serve = originalServe;
    process.env.NODE_ENV = originalEnv;
  });
});