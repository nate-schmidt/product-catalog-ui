/**
 * Bun server entry point for the Product Catalog UI.
 *
 * The server performs two primary duties:
 * 1. Serves the compiled single-page application (SPA) from `index.html` for
 *    any route that is not explicitly handled by an API endpoint. This allows
 *    client-side routing libraries (e.g. React Router) to manage navigation
 *    without additional server configuration.
 * 2. Exposes a handful of example JSON endpoints (`/api/hello`) that illustrate
 *    how to handle REST-style requests in Bun. These are purely for local
 *    development/testing purposes and should be replaced with real backend
 *    calls once the product-catalog-service is integrated.
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
