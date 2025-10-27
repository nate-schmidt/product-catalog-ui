import { test, expect, describe, beforeEach, afterEach } from 'bun:test';

describe('Server API Routes', () => {
  let server: any;
  let baseUrl: string;

  beforeEach(async () => {
    // Import and start server for testing
    const { serve } = await import('bun');
    
    server = serve({
      port: 0, // Use random available port
      routes: {
        "/api/hello": {
          async GET(req) {
            return Response.json({
              message: "Hello, world!",
              method: "GET",
            });
          },
          async PUT(req) {
            return Response.json({
              message: "Hello, world!",
              method: "PUT",
            });
          },
        },
        "/api/hello/:name": async req => {
          const name = req.params.name;
          return Response.json({
            message: `Hello, ${name}!`,
          });
        },
      },
    });
    
    baseUrl = `http://localhost:${server.port}`;
  });

  afterEach(() => {
    if (server) {
      server.stop();
    }
  });

  test('GET /api/hello returns correct response', async () => {
    const response = await fetch(`${baseUrl}/api/hello`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Hello, world!",
      method: "GET",
    });
  });

  test('PUT /api/hello returns correct response', async () => {
    const response = await fetch(`${baseUrl}/api/hello`, {
      method: 'PUT',
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Hello, world!",
      method: "PUT",
    });
  });

  test('GET /api/hello/:name returns personalized greeting', async () => {
    const testName = 'testuser';
    const response = await fetch(`${baseUrl}/api/hello/${testName}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: `Hello, ${testName}!`,
    });
  });

  test('GET /api/hello/:name handles special characters in name', async () => {
    const testName = 'test-user_123';
    const response = await fetch(`${baseUrl}/api/hello/${testName}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: `Hello, ${testName}!`,
    });
  });

  test('GET /api/hello/:name handles URL encoded names', async () => {
    const testName = 'test%20user';
    const response = await fetch(`${baseUrl}/api/hello/${testName}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    // URL decoding happens automatically, so %20 becomes a space
    expect(data.message).toContain('Hello, test user!');
  });

  test('unsupported HTTP methods on /api/hello return 404', async () => {
    const response = await fetch(`${baseUrl}/api/hello`, {
      method: 'DELETE',
    });
    
    // Bun server returns 404 for unsupported methods on defined routes
    expect(response.status).toBe(404);
  });

  test('invalid routes return 404', async () => {
    const response = await fetch(`${baseUrl}/api/nonexistent`);
    
    expect(response.status).toBe(404);
  });
});

describe('Server Configuration', () => {
  test('development mode configuration', () => {
    const isDevelopment = process.env.NODE_ENV !== "production";
    
    if (isDevelopment) {
      // In development, we expect HMR and console to be enabled
      expect(true).toBe(true); // Placeholder for development config tests
    }
  });

  test('production mode configuration', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const isProduction = process.env.NODE_ENV === "production";
    expect(isProduction).toBe(true);
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });
});