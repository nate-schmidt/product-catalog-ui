import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req: any) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req: any) {
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

    "/api/coupon/:code": async (req: any) => {
      const code = req.params.code?.toUpperCase();
      const coupons: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        FREESHIP: 0, // Example of non-percentage coupon
      };

      if (code && coupons[code] !== undefined) {
        return Response.json({ valid: true, discount: coupons[code] });
      }

      return Response.json({ valid: false, discount: 0 });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
