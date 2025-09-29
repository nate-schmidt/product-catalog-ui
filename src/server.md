# Server Component Documentation (index.tsx)

## Overview

The `index.tsx` file serves as the main Bun server entry point for the product catalog application. It provides both static file serving for the React frontend and basic API endpoints, combining full-stack functionality in a single server instance.

## Current Functionality

This server module provides:
- Static file serving for the React application
- RESTful API endpoints for basic operations
- Development features (hot module replacement, console logging)
- Single-page application routing support

## Code Structure

```tsx
import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
    "/api/hello": {
      async GET(req) { /* ... */ },
      async PUT(req) { /* ... */ }
    },
    "/api/hello/:name": async req => { /* ... */ }
  },
  development: {
    hmr: true,
    console: true,
  }
});
```

## Route Configuration

### Static File Routes

#### `"/*"` - Catch-All Route
- **Purpose**: Serves the React application for all unmatched routes
- **Handler**: Returns the HTML template (`index.html`)
- **Function**: Enables single-page application (SPA) routing
- **Behavior**: Ensures React Router or client-side routing works properly

### API Routes

#### `/api/hello` - Basic API Endpoint
- **GET Method**: Returns a simple JSON response with "Hello, world!" message
- **PUT Method**: Returns a similar response but indicates the PUT method was used
- **Response Format**: `{ message: string, method: string }`
- **Purpose**: Demonstrates basic REST API functionality

#### `/api/hello/:name` - Parameterized Endpoint  
- **Method**: Handles all HTTP methods
- **Parameter**: Accepts a `name` parameter from the URL path
- **Response**: `{ message: "Hello, {name}!" }`
- **Purpose**: Shows dynamic route parameter handling

## Integration with System

### Frontend Integration
- Serves the React application built from `frontend.tsx`
- Delivers the HTML template containing the React root element
- Handles routing for client-side navigation

### Build System Integration
- Processes and serves bundled assets from the build system
- Works with Bun's native bundler and optimization features
- Serves compiled JavaScript, CSS, and other static assets

### Development Features
- **Hot Module Replacement (HMR)**: Enables live code reloading during development
- **Console Echoing**: Forwards browser console logs to the server terminal
- **Environment Detection**: Only enables development features when not in production

## Architecture Patterns

### Full-Stack Single Server
- Combines frontend serving with backend API in one process
- Eliminates need for separate frontend/backend servers
- Simplifies deployment and development setup

### RESTful API Design
- Follows REST conventions for HTTP methods
- Uses JSON for request/response data
- Implements proper HTTP status codes and methods

### SPA Support
- Catch-all routing ensures client-side routing works
- Serves the same HTML template for all non-API routes
- Allows React Router to handle route resolution

## Performance Features

### Bun Runtime Benefits
- Fast JavaScript/TypeScript execution
- Built-in bundling and transpilation
- Native HTTP server implementation
- Optimized for both development and production

### Development Optimizations
- Hot reloading for rapid iteration
- Console integration for debugging
- Source map support for error tracking

## Configuration

### Environment-Based Settings
```tsx
development: process.env.NODE_ENV !== "production" && {
  hmr: true,
  console: true,
}
```
- Automatically disables development features in production
- Uses NODE_ENV environment variable for detection
- Ensures production builds are optimized

## Future Expansion Plans

The server is designed to be expanded with:
- **Product API endpoints** for catalog management
- **Cart management APIs** for shopping functionality  
- **User authentication** endpoints
- **Order processing** capabilities
- **Coupon/discount** API integration
- **Payment processing** integration

## Security Considerations

### Current State
- No authentication or authorization implemented
- Basic CORS handling through Bun defaults
- No input validation on API endpoints

### Recommended Improvements
- Add request validation and sanitization
- Implement authentication middleware  
- Add rate limiting for API endpoints
- Configure proper CORS policies
- Add HTTPS support for production

## Dependencies

- **Bun**: Runtime and HTTP server framework
- **HTML Template**: Imports and serves the static HTML file
- **Environment Variables**: NODE_ENV for configuration

## Monitoring and Logging

### Development Logging
- Browser console logs echoed to server
- Request/response logging through Bun
- Error stack traces in development mode

### Production Considerations
- Should add structured logging
- Implement error tracking and monitoring
- Add health check endpoints
- Consider adding metrics collection

## Related Components

- **`frontend.tsx`**: React application served by this server
- **`index.html`**: HTML template served by catch-all route
- **`build.ts`**: Build configuration that processes served assets
- **Future APIs**: Will host product, cart, and user management endpoints