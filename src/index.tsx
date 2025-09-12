import { serve } from "bun";
import index from "./index.html";
import { products, getActiveFlashSale, computeDiscountedPriceCents } from "./data";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/products": async () => {
      return Response.json({ products });
    },

    "/api/flash-sale/current": async () => {
      const sale = getActiveFlashSale(new Date());
      return Response.json({ sale });
    },

    "/api/flash-sale/summary": async () => {
      const sale = getActiveFlashSale(new Date());
      if (!sale) {
        return Response.json({ sale: null, items: [], serverTime: new Date().toISOString() });
      }

      const items = products
        .filter(p => sale.discounts[p.id] != null)
        .map(p => ({
          productId: p.id,
          name: p.name,
          originalPriceCents: p.priceCents,
          discountedPriceCents: computeDiscountedPriceCents(p, sale),
          discountPercent: sale.discounts[p.id],
        }));

      return Response.json({
        sale,
        items,
        serverTime: new Date().toISOString(),
      });
    },

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
  },

  development: Bun.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
