import { serve } from "bun";
import index from "./index.html";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

// Helper function to proxy API requests
async function proxyApiRequest(request: Request, endpoint: string) {
  const url = new URL(request.url);
  const targetUrl = `${API_BASE_URL}${endpoint}${url.search}`;
  
  console.log(`Proxying ${request.method} ${url.pathname} to ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'Host': new URL(API_BASE_URL).host,
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });

    // Clone response and add CORS headers
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

    return clonedResponse;
  } catch (error) {
    console.error(`Proxy error for ${targetUrl}:`, error);
    return Response.json(
      { 
        error: 'Proxy Error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        target: targetUrl 
      }, 
      { 
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

const server = serve({
  routes: {
    // API Proxy Routes
    "/api/products": {
      async GET(req) {
        return proxyApiRequest(req, '/products');
      },
      async POST(req) {
        return proxyApiRequest(req, '/products');
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      },
    },

    "/api/products/search": {
      async GET(req) {
        return proxyApiRequest(req, '/products/search');
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      },
    },

    "/api/products/:id": {
      async GET(req) {
        return proxyApiRequest(req, `/products/${req.params.id}`);
      },
      async PUT(req) {
        return proxyApiRequest(req, `/products/${req.params.id}`);
      },
      async DELETE(req) {
        return proxyApiRequest(req, `/products/${req.params.id}`);
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      },
    },

    "/api/categories": {
      async GET(req) {
        return proxyApiRequest(req, '/categories');
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      },
    },

    // Fallback for any other API routes
    "/api/*": {
      async GET(req) {
        const url = new URL(req.url);
        const apiPath = url.pathname.replace('/api', '');
        return proxyApiRequest(req, apiPath);
      },
      async POST(req) {
        const url = new URL(req.url);
        const apiPath = url.pathname.replace('/api', '');
        return proxyApiRequest(req, apiPath);
      },
      async PUT(req) {
        const url = new URL(req.url);
        const apiPath = url.pathname.replace('/api', '');
        return proxyApiRequest(req, apiPath);
      },
      async DELETE(req) {
        const url = new URL(req.url);
        const apiPath = url.pathname.replace('/api', '');
        return proxyApiRequest(req, apiPath);
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      },
    },

    // Original example routes (keeping for reference)
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

    // Serve index.html for all unmatched routes (SPA fallback)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`Server running on http://localhost:${server.port}`);
console.log(`Proxying API requests to: ${API_BASE_URL}`);
