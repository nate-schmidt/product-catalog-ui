/*
 * Bun HTTP Server (index.tsx)
 * --------------------------
 * This file spins up a lightweight HTTP server using Bun’s built-in `serve`
 * helper. It is the **backend** counterpart to our React frontend, exposing a
 * handful of JSON endpoints used for demonstration and integration tests.
 *
 * High-level behaviour
 * • Serves the static `index.html` document for every unmatched route, enabling
 *   client-side routing in the SPA.
 * • Exposes two variations of a `hello` endpoint to showcase parameterised
 *   routes as well as different HTTP method handlers.
 *
 * Available routes
 * 1. `/*` (wildcard) → returns `index.html` so that the React application can
 *    handle routing on the client.
 *
 * 2. `/api/hello` – JSON API
 *    • GET → `{ message: "Hello, world!", method: "GET" }`
 *    • PUT → `{ message: "Hello, world!", method: "PUT" }`
 *
 * 3. `/api/hello/:name` – Path parameter example
 *    • GET → `{ message: "Hello, <name>!" }`
 *
 * Development-only features (enabled when NODE_ENV !== "production")
 * • Hot Module Reloading (HMR) – automatically refreshes the browser when
 *   frontend code changes.
 * • Console mirroring – forwards `console.*` output from the browser back to
 *   the server terminal for easier debugging.
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
