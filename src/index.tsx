import { serve } from "bun";
import index from "./index.html";
import { products } from "./data/products";
import { computeSummary } from "./lib/pricing";
import type { CheckoutRequest, ValidateCouponRequest } from "./types";

type RouteReq = Request & { params: Record<string, string> };

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index as any,

    // Products API
    "/api/products": async () => Response.json({ products }),

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

    // Validate coupon and price summary
    "/api/coupons/validate": {
      async POST(req: Request) {
        const body = (await req.json()) as ValidateCouponRequest;
        const summary = computeSummary(body.items || [], body.code || null);
        // If coupon code existed but did not apply, embed minimal reason by recomputing without code to compare
        let valid = false;
        let reason: string | undefined;
        if (body.code && body.code.trim().length > 0) {
          if (summary.coupon) valid = true;
          else {
            // compute without coupon to ensure subtotalCents
            const noCoupon = computeSummary(body.items || [], null);
            const subtotal = noCoupon.subtotalCents;
            // Provide a generic reason; fine-tuning reasons requires exposing validateCoupon directly
            reason = subtotal <= 0 ? "Cart is empty" : "Coupon is not applicable";
          }
        }
        return Response.json({ valid, reason, summary });
      },
    },

    // Checkout endpoint
    "/api/checkout": {
      async POST(req: Request) {
        const body = (await req.json()) as CheckoutRequest;
        const summary = computeSummary(body.items || [], body.couponCode || null);
        if (summary.totalCents <= 0) {
          return Response.json({ ok: false, error: "Order total must be greater than zero", summary }, { status: 400 });
        }
        // In a real app: create order, charge payment, etc.
        const orderId = `ord_${Math.random().toString(36).slice(2, 10)}`;
        return Response.json({ ok: true, orderId, summary });
      },
    },

    "/api/hello/:name": async (req: RouteReq) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: Bun.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
