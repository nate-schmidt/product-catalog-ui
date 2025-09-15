import { serve } from "bun";
import index from "./index.html";
import { furnitureProducts } from "./data/products";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/products": {
      async GET(req) {
        return Response.json(furnitureProducts);
      },
    },

    "/api/products/:id": async req => {
      const id = req.params.id;
      const product = furnitureProducts.find(p => p.id === id);
      
      if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }
      
      return Response.json(product);
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
