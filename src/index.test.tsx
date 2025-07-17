import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { serve } from 'bun';

describe('API Endpoints', () => {
  let server: any;
  let baseUrl: string;

  beforeAll(() => {
    // Start a test server on a random port
    server = serve({
      port: 0, // Random available port
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

  afterAll(() => {
    server?.stop();
  });

  describe('GET /api/hello', () => {
    test('returns correct response', async () => {
      const response = await fetch(`${baseUrl}/api/hello`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        message: "Hello, world!",
        method: "GET",
      });
    });

    test('returns correct content-type', async () => {
      const response = await fetch(`${baseUrl}/api/hello`);
      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('PUT /api/hello', () => {
    test('returns correct response', async () => {
      const response = await fetch(`${baseUrl}/api/hello`, {
        method: 'PUT',
      });
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        message: "Hello, world!",
        method: "PUT",
      });
    });

    test('handles request body', async () => {
      const response = await fetch(`${baseUrl}/api/hello`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/hello/:name', () => {
    test('returns personalized greeting', async () => {
      const response = await fetch(`${baseUrl}/api/hello/John`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        message: "Hello, John!",
      });
    });

    test('handles special characters in name', async () => {
      const response = await fetch(`${baseUrl}/api/hello/John%20Doe`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        message: "Hello, John Doe!",
      });
    });

    test('handles unicode characters', async () => {
      const response = await fetch(`${baseUrl}/api/hello/José`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        message: "Hello, José!",
      });
    });
  });

  describe('Error Handling', () => {
    test('returns 404 for unknown routes', async () => {
      const response = await fetch(`${baseUrl}/api/unknown`);
      expect(response.status).toBe(404);
    });

    test('handles method not allowed', async () => {
      const response = await fetch(`${baseUrl}/api/hello`, {
        method: 'DELETE',
      });
      // The simple server returns 404 for unsupported methods
      expect(response.status).toBe(404);
    });
  });
});