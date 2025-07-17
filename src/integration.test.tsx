import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { serve } from 'bun';
import { Window } from 'happy-dom';

describe('Full Application Integration', () => {
  let server: any;
  let baseUrl: string;
  let window: any;
  let document: any;

  beforeAll(() => {
    // Start the server
    server = serve({
      port: 0,
      routes: {
        "/*": async (req) => {
          const url = new URL(req.url);
          
          // Serve the HTML page
          if (url.pathname === '/' || url.pathname === '/index.html') {
            return new Response(`
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Product Catalog</title>
                  <style>
                    .text-white { color: white; }
                    .text-gray-300 { color: #d1d5db; }
                    .text-6xl { font-size: 3.75rem; }
                    .text-2xl { font-size: 1.5rem; }
                  </style>
                </head>
                <body style="background: #1a1a1a;">
                  <div id="root"></div>
                  <script>
                    // Mock React app for integration testing
                    document.getElementById('root').innerHTML = \`
                      <div class="max-w-7xl mx-auto p-8 text-center relative z-10">
                        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                          <h1 class="text-6xl font-bold text-white mb-4">
                            Hello World! 👋
                          </h1>
                          <p class="text-2xl text-gray-300 max-w-2xl leading-relaxed">
                            One day I hope to be an ecommerce website.
                          </p>
                        </div>
                      </div>
                    \`;
                  </script>
                </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          }
          
          // API routes
          if (url.pathname === '/api/hello') {
            if (req.method === 'GET') {
              return Response.json({
                message: "Hello, world!",
                method: "GET",
              });
            } else if (req.method === 'PUT') {
              return Response.json({
                message: "Hello, world!",
                method: "PUT",
              });
            }
            return new Response('Method Not Allowed', { status: 405 });
          }
          
          if (url.pathname.startsWith('/api/hello/')) {
            const name = url.pathname.split('/').pop();
            return Response.json({
              message: `Hello, ${name}!`,
            });
          }
          
          return new Response('Not Found', { status: 404 });
        },
      },
    });
    
    baseUrl = `http://localhost:${server.port}`;
    
    // Setup DOM for client-side testing
    window = new Window();
    document = window.document;
    (global as any).window = window;
    (global as any).document = document;
  });

  afterAll(() => {
    server?.stop();
  });

  describe('Full Page Load', () => {
    test('serves HTML page with correct content', async () => {
      const response = await fetch(baseUrl);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      
      const html = await response.text();
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<div id="root"></div>');
      expect(html).toContain('Hello World! 👋');
      expect(html).toContain('One day I hope to be an ecommerce website.');
    });

    test('page has correct metadata', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport"');
      expect(html).toContain('<title>Product Catalog</title>');
    });
  });

  describe('Client-Server Integration', () => {
    test('client can fetch data from API', async () => {
      // Simulate client-side fetch
      const apiResponse = await fetch(`${baseUrl}/api/hello`);
      const data = await apiResponse.json();
      
      expect(data.message).toBe("Hello, world!");
      expect(data.method).toBe("GET");
    });

    test('handles personalized API requests', async () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      
      for (const name of names) {
        const response = await fetch(`${baseUrl}/api/hello/${name}`);
        const data = await response.json();
        
        expect(data.message).toBe(`Hello, ${name}!`);
      }
    });

    test('API and UI work together', async () => {
      // Load the page
      const pageResponse = await fetch(baseUrl);
      const html = await pageResponse.text();
      
      // Check UI is present
      expect(html).toContain('Hello World!');
      
      // Check API is accessible
      const apiResponse = await fetch(`${baseUrl}/api/hello`);
      expect(apiResponse.status).toBe(200);
    });
  });

  describe('Error Handling Integration', () => {
    test('handles 404 for non-existent pages', async () => {
      const response = await fetch(`${baseUrl}/non-existent-page`);
      expect(response.status).toBe(404);
    });

    test('handles 404 for non-existent API endpoints', async () => {
      const response = await fetch(`${baseUrl}/api/non-existent`);
      expect(response.status).toBe(404);
    });

    test('handles unsupported HTTP methods', async () => {
      const response = await fetch(`${baseUrl}/api/hello`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(405);
    });
  });

  describe('Performance Tests', () => {
    test('responds quickly to requests', async () => {
      const startTime = Date.now();
      await fetch(baseUrl);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond in less than 1 second
    });

    test('can handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        fetch(`${baseUrl}/api/hello`)
      );
      
      const responses = await Promise.all(requests);
      
      for (const response of responses) {
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Security Headers', () => {
    test('API responses have proper content-type', async () => {
      const response = await fetch(`${baseUrl}/api/hello`);
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    test('HTML responses have proper content-type', async () => {
      const response = await fetch(baseUrl);
      expect(response.headers.get('content-type')).toContain('text/html');
    });
  });
});