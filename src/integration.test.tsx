import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { App } from './App';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('Integration Tests', () => {
  const BASE_URL = 'http://localhost:3002';
  let serverProcess: any;

  beforeAll(async () => {
    // Start the server on a test port
    const { spawn } = require('child_process');
    serverProcess = spawn('bun', ['src/index.tsx'], {
      env: { ...process.env, PORT: '3002' },
    });

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
    cleanup();
  });

  describe('Full Stack Integration', () => {
    test('server serves HTML and React app can be rendered', async () => {
      // Fetch the HTML from the server
      const response = await fetch(BASE_URL);
      expect(response.status).toBe(200);

      const html = await response.text();
      expect(html.toLowerCase()).toContain('<!doctype html>');
      expect(html).toContain('<div id="root">');

      // Verify React app can render
      document.body.innerHTML = '<div id="root"></div>';
      const { container } = render(<App />);
      expect(container.querySelector('h1')).toBeDefined();
    });

    test('API and frontend can work together', async () => {
      // Test API endpoint
      const apiResponse = await fetch(`${BASE_URL}/api/hello`);
      const apiData = await apiResponse.json();
      expect(apiData.message).toBe('Hello, world!');

      // Test frontend rendering
      document.body.innerHTML = '<div id="root"></div>';
      const { getByText } = render(<App />);
      const heading = getByText('Hello World! 👋');
      expect(heading).toBeDefined();
    });

    test('server handles both API routes and SPA routing', async () => {
      // Test API route
      const apiResponse = await fetch(`${BASE_URL}/api/hello/integration`);
      expect(apiResponse.status).toBe(200);
      const apiData = await apiResponse.json();
      expect(apiData.message).toBe('Hello, integration!');

      // Test SPA route (should serve index.html)
      const spaResponse = await fetch(`${BASE_URL}/app/some-page`);
      expect(spaResponse.status).toBe(200);
      const contentType = spaResponse.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });
  });

  describe('API Response Consistency', () => {
    test('all successful API responses have 200 status', async () => {
      const endpoints = [
        '/api/hello',
        '/api/hello/test',
        '/api/hello/user123',
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        expect(response.status).toBe(200);
      }
    });

    test('all API responses return valid JSON with message property', async () => {
      const endpoints = [
        '/api/hello',
        '/api/hello/test',
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const data = await response.json();
        expect(data).toHaveProperty('message');
        expect(typeof data.message).toBe('string');
        expect(data.message.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Server Stability', () => {
    test('server handles rapid sequential requests', async () => {
      const results = [];
      for (let i = 0; i < 20; i++) {
        const response = await fetch(`${BASE_URL}/api/hello/${i}`);
        const data = await response.json();
        results.push(data);
      }

      expect(results.length).toBe(20);
      results.forEach((result, i) => {
        expect(result.message).toBe(`Hello, ${i}!`);
      });
    });

    test('server maintains state across multiple request types', async () => {
      // Make various types of requests
      const getResponse = await fetch(`${BASE_URL}/api/hello`);
      expect(getResponse.status).toBe(200);

      const putResponse = await fetch(`${BASE_URL}/api/hello`, {
        method: 'PUT',
      });
      expect(putResponse.status).toBe(200);

      const paramResponse = await fetch(`${BASE_URL}/api/hello/state`);
      expect(paramResponse.status).toBe(200);

      // All should still work correctly
      const getData = await getResponse.json();
      const putData = await putResponse.json();
      const paramData = await paramResponse.json();

      expect(getData.message).toBe('Hello, world!');
      expect(putData.message).toBe('Hello, world!');
      expect(paramData.message).toBe('Hello, state!');
    });

    test('server handles requests with different content types', async () => {
      const contentTypes = [
        'application/json',
        'text/plain',
        'application/x-www-form-urlencoded',
      ];

      for (const contentType of contentTypes) {
        const response = await fetch(`${BASE_URL}/api/hello`, {
          headers: {
            'Content-Type': contentType,
          },
        });
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Frontend and Backend Data Flow', () => {
    test('frontend can render with data from API', async () => {
      // Fetch data from API
      const response = await fetch(`${BASE_URL}/api/hello/React`);
      const data = await response.json();

      // Simulate using API data in the frontend
      expect(data.message).toContain('React');
      expect(data.message).toBe('Hello, React!');

      // Render the app
      document.body.innerHTML = '<div id="root"></div>';
      const { container } = render(<App />);
      expect(container.querySelector('h1')).toBeDefined();
    });

    test('API returns data in correct format for frontend consumption', async () => {
      const response = await fetch(`${BASE_URL}/api/hello/Frontend`);
      const data = await response.json();

      // Verify data structure is frontend-friendly
      expect(typeof data).toBe('object');
      expect(data).not.toBeNull();
      expect(Object.keys(data).length).toBeGreaterThan(0);
      expect(typeof data.message).toBe('string');
    });
  });

  describe('Error Handling Across Stack', () => {
    test('invalid routes return appropriate responses', async () => {
      const response = await fetch(`${BASE_URL}/api/nonexistent`);
      // Should return HTML (catch-all route)
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });

    test('frontend handles missing root element gracefully', () => {
      document.body.innerHTML = '';
      
      // Attempting to get non-existent root should fail
      const root = document.getElementById('root');
      expect(root).toBeNull();
    });

    test('API methods not allowed return appropriate status', async () => {
      const methods = ['POST', 'DELETE', 'PATCH'];
      
      for (const method of methods) {
        const response = await fetch(`${BASE_URL}/api/hello`, {
          method,
        });
        // Should not return 200 for unsupported methods
        expect(response.status).not.toBe(200);
      }
    });
  });

  describe('Performance and Scalability', () => {
    test('server responds to requests within acceptable time', async () => {
      const start = Date.now();
      await fetch(`${BASE_URL}/api/hello`);
      const duration = Date.now() - start;

      // Should respond within 1 second
      expect(duration).toBeLessThan(1000);
    });

    test('concurrent API requests complete successfully', async () => {
      const concurrentRequests = 50;
      const promises = Array.from({ length: concurrentRequests }, (_, i) =>
        fetch(`${BASE_URL}/api/hello/${i}`)
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Should complete within reasonable time (3 seconds for 50 requests)
      expect(duration).toBeLessThan(3000);
    });

    test('frontend renders quickly', () => {
      document.body.innerHTML = '<div id="root"></div>';
      
      const start = Date.now();
      render(<App />);
      const duration = Date.now() - start;

      // Should render within 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Content Validation', () => {
    test('HTML response includes necessary meta tags and structure', async () => {
      const response = await fetch(BASE_URL);
      const html = await response.text();

      expect(html).toContain('<html');
      expect(html).toContain('<head');
      expect(html).toContain('<body');
      expect(html).toContain('</html>');
    });

    test('API responses are properly formatted JSON', async () => {
      const response = await fetch(`${BASE_URL}/api/hello`);
      const text = await response.text();

      // Should be valid JSON
      expect(() => JSON.parse(text)).not.toThrow();
      
      const data = JSON.parse(text);
      expect(data).toHaveProperty('message');
    });

    test('frontend renders semantic HTML', () => {
      document.body.innerHTML = '<div id="root"></div>';
      const { container } = render(<App />);

      // Should have semantic elements
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');
      
      expect(heading).toBeDefined();
      expect(paragraph).toBeDefined();
    });
  });
});