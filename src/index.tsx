import { serve } from "bun";
import index from "./index.html";

// Export API routes for unit testing without starting a server
export const apiRoutes = {
  "/api/hello": {
    async GET(_req: any) {
      return Response.json({
        message: "Hello, world!",
        method: "GET",
      });
    },
    async PUT(_req: any) {
      return Response.json({
        message: "Hello, world!",
        method: "PUT",
      });
    },
  },

  "/api/hello/:name": async (req: any) => {
    const name = req.params.name;
    return Response.json({
      message: `Hello, ${name}!`,
    });
  },
} as const;

// Full routes map used by the server
export const routes = {
  // Serve index.html for all unmatched routes.
  "/*": index,
  ...apiRoutes,
} as const;

// Start the server only when executed directly, not when imported by tests
if (import.meta.main) {
  serve({
    routes,
    development: process.env.NODE_ENV !== "production" && {
      // Enable browser hot reloading in development
      hmr: true,

      // Echo console logs from the browser to the server
      console: true,
    },
  });
}
