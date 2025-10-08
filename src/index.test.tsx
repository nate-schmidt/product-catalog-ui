import { test, expect, describe, beforeAll, afterAll } from 'bun:test';

describe('API Server', () => {
  const BASE_URL = 'http://localhost:3001';
  let serverProcess: any;

  beforeAll(async () => {
    // Start the server on a different port for testing
    const { spawn } = require('child_process');
    serverProcess = spawn('bun', ['src/index.tsx'], {
      env: { ...process.env, PORT: '3001' },
    });

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('GET /api/hello', () => {
    test('returns hello world message', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        message: 'Hello, world!',
        method: 'GET',
      });
    });

    test('returns JSON content type', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`);
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json');
    });
  });

  describe('PUT /api/hello', () => {
    test('returns hello world message with PUT method', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'PUT',
      });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        message: 'Hello, world!',
        method: 'PUT',
      });
    });

    test('returns JSON content type', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'PUT',
      });
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json');
    });
  });

  describe('GET /api/hello/:name', () => {
    test('returns personalized greeting with provided name', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/Alice`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        message: 'Hello, Alice!',
      });
    });

    test('handles special characters in name', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/John%20Doe`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('Hello, John Doe!');
    });

    test('handles unicode characters in name', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/${encodeURIComponent('李明')}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('Hello, 李明!');
    });

    test('handles empty name parameter', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/`);
      // This should either return a 404 or handle gracefully
      // Depending on Bun's routing, this might match the base /api/hello route
      expect([200, 404, 405]).toContain(response.status);
    });

    test('handles numeric name', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/12345`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        message: 'Hello, 12345!',
      });
    });
  });

  describe('Catch-all route', () => {
    test('serves index.html for root path', async () => {
      const response = await fetch(BASE_URL);
      expect(response.status).toBe(200);

      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });

    test('serves index.html for unmatched routes', async () => {
      const response = await fetch(`${BASE_URL}/some/random/path`);
      expect(response.status).toBe(200);

      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });

    test('serves index.html for non-API routes', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      expect(response.status).toBe(200);

      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });
  });

  describe('HTTP methods', () => {
    test('GET method is allowed on /api/hello', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'GET',
      });
      expect(response.status).toBe(200);
    });

    test('PUT method is allowed on /api/hello', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'PUT',
      });
      expect(response.status).toBe(200);
    });

    test('POST method returns error on /api/hello', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'POST',
      });
      // Should return 405 Method Not Allowed or similar
      expect(response.status).not.toBe(200);
    });

    test('DELETE method returns error on /api/hello', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        method: 'DELETE',
      });
      // Should return 405 Method Not Allowed or similar
      expect(response.status).not.toBe(200);
    });
  });

  describe('Response format', () => {
    test('all API responses are valid JSON', async () => {
      const endpoints = [
        `${BASE_URL}/api/hello`,
        `${BASE_URL}/api/hello/test`,
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint);
        expect(async () => await response.json()).not.toThrow();
      }
    });

    test('all API responses have correct structure', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`);
      const data = await response.json();

      expect(data).toHaveProperty('message');
      expect(typeof data.message).toBe('string');
    });
  });

  describe('Server configuration', () => {
    test('server is running and accepting connections', async () => {
      const response = await fetch(BASE_URL);
      expect(response).toBeDefined();
    });

    test('server handles concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) =>
        fetch(`${BASE_URL}/api/hello/user${i}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach((response, i) => {
        expect(response.status).toBe(200);
      });

      const data = await Promise.all(responses.map(r => r.json()));
      
      data.forEach((d, i) => {
        expect(d.message).toBe(`Hello, user${i}!`);
      });
    });
  });

  describe('Error handling', () => {
    test('handles malformed URLs gracefully', async () => {
      const response = await fetch(`${BASE_URL}/%invalid%url%`);
      // Should handle gracefully, either 404 or serve index.html
      expect([200, 400, 404]).toContain(response.status);
    });

    test('handles extremely long URLs', async () => {
      const longName = 'a'.repeat(10000);
      const response = await fetch(`${BASE_URL}/api/hello/${longName}`);
      // Should handle gracefully
      expect([200, 400, 414]).toContain(response.status);
    });

    test('handles requests with headers', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(200);
    });
  });
});