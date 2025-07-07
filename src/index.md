# `index.tsx` Bun Server Entry Point

**File:** `src/index.tsx`

## Overview
This file boots a lightweight Bun server that powers the development and
production versions of the Product Catalog UI. It serves the compiled SPA and
exposes sample REST-like API routes used for demonstration/testing purposes.

The server is not intended to be the permanent backend for the application;
long-term, the React SPA will communicate with the dedicated FastAPI service
found in the `product-catalog-service` folder.

## Responsibilities
1. Serve `index.html` for all unknown routes, enabling client-side routing.
2. Declare example JSON endpoints (e.g. `/api/hello`, `/api/hello/:name`).
3. Enable Hot Module Reloading (HMR) and console mirroring in development
   mode to streamline the developer experience.

## Configuration
* **Port:** Implicitly handled by Bun (default `BUN_PORT` or 3000).  
* **Environment:** `NODE_ENV` toggles production vs. development extras.

## Exports / Returns
The call to `serve()` returns a `Server` instance exposed as the `server`
constant. No explicit exports are made from the module.

## Future Enhancements
1. **Proxy Requests:** Forward API calls to the FastAPI microservice to avoid
   CORS issues during local development.
2. **Static Assets:** Add middleware for serving images or compiled assets from
   a `public/` directory.
3. **Security:** Implement sensible defaults (compression, rate-limiting,
   content-security-policy headers) before deploying to production.