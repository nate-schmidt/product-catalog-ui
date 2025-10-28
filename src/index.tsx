import { serve } from "bun";
import index from "./index.html";

// Helper to parse a valid port from env
function getPreferredPort(): number {
  const raw = process.env.PORT ?? process.env.BUN_PORT;
  if (!raw) return 3000;
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0 && parsed < 65536) return parsed;
  return 3000;
}

function createServerConfig(port: number) {
  return {
    port,
    routes: {
      // Serve index.html for all unmatched routes.
      "/*": index,

      "/api/hello": {
        async GET(req: Request) {
          return Response.json({
            message: "Hello, world!",
            method: "GET",
          });
        },
        async PUT(req: Request) {
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
    },

    development: process.env.NODE_ENV !== "production" && {
      // Enable browser hot reloading in development
      hmr: true,

      // Echo console logs from the browser to the server
      console: true,
    },
  } as const;
}

// Attempt to bind to the preferred port, falling back on conflicts
const preferredPort = getPreferredPort();
const maxAttempts = 15;
let currentPort = preferredPort;
let server: ReturnType<typeof serve> | undefined;

for (let attempt = 0; attempt < maxAttempts; attempt++) {
  try {
    server = serve(createServerConfig(currentPort));
    if (currentPort !== preferredPort) {
      console.warn(
        `[dev] Port ${preferredPort} in use; started on ${currentPort} instead.`,
      );
    }
    console.log(`[dev] Listening on http://localhost:${currentPort}`);
    break;
  } catch (error: unknown) {
    const err = error as any;
    const isAddrInUse =
      err?.code === "EADDRINUSE" || /EADDRINUSE|in use|listen/i.test(String(err));
    if (isAddrInUse) {
      currentPort += 1;
      continue;
    }
    throw error;
  }
}

if (!server) {
  throw new Error(
    `Failed to start server after ${maxAttempts} attempts starting at ${preferredPort}.`,
  );
}
