/**
 * Bun server entry point.
 *
 * Serves the React single-page application (SPA) from `index.html` and exposes
 * a minimal sample REST API used in documentation and integration tests.
 *
 * Available routes:
 *  - `GET  /api/hello`        → `{ message, method }`
 *  - `PUT  /api/hello`        → `{ message, method }`
 *  - `GET  /api/hello/:name`  → `{ message }`
 *
 * During development (`NODE_ENV !== "production"`) Hot Module Reloading (HMR)
 * and console log forwarding are enabled.
 */
import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

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

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
