import { serve } from "bun";
import index from "./index.html";
import { listProductsCached, listFlashSales, createFlashSale, deleteFlashSale, updateFlashSale, checkout } from "./db";
import type { CreateFlashSaleInput, CheckoutRequest } from "./types";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/products": async req => {
      const products = listProductsCached();
      return Response.json(products);
    },

    "/api/flash-sales": {
      async GET() {
        const sales = listFlashSales();
        return Response.json(sales);
      },
      async POST(req) {
        try {
          const body = (await req.json()) as CreateFlashSaleInput;
          const sale = createFlashSale(body);
          return Response.json(sale, { status: 201 });
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), { status: 400 });
        }
      },
    },

    "/api/flash-sales/:id": {
      async PUT(req) {
        try {
          const id = Number(req.params.id);
          const body = (await req.json()) as Partial<CreateFlashSaleInput>;
          const sale = updateFlashSale(id, body);
          return Response.json(sale);
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), { status: 400 });
        }
      },
      async DELETE(req) {
        try {
          const id = Number(req.params.id);
          deleteFlashSale(id);
          return new Response(undefined, { status: 204 });
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), { status: 400 });
        }
      },
    },

    "/api/checkout": {
      async POST(req) {
        try {
          const body = (await req.json()) as CheckoutRequest;
          const result = checkout(body);
          return Response.json(result);
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), { status: 400 });
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
