import { serve } from "bun";
import index from "./index.html";
import { findCoupon, applyCoupon } from "./coupons";

const server = serve({
  routes: {
    // Coupon validation endpoint
    "/api/coupon/:code": async (req: BunRequest<{ code: string }>) => {
      const { code } = req.params as { code: string };
      const coupon = findCoupon(code);
      if (!coupon) {
        return new Response(
          JSON.stringify({ valid: false, message: "Invalid or expired coupon" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }
      return Response.json({ valid: true, coupon });
    },

    // Apply coupon to a subtotal
    "/api/apply-coupon": {
      async POST(req: BunRequest<{}>) {
        try {
          const { code, subtotal } = (await req.json()) as {
            code: string;
            subtotal: number;
          };

          const coupon = findCoupon(code);
          if (!coupon)
            return Response.json(
              { error: "Invalid or expired coupon" },
              { status: 400 },
            );

          const { total, discount } = applyCoupon(subtotal, coupon);
          return Response.json({ total, discount, coupon });
        } catch (err) {
          return Response.json({ error: "Malformed request" }, { status: 400 });
        }
      },
    },

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

    "/api/hello/:name": async (req: BunRequest<{ name: string }>) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
