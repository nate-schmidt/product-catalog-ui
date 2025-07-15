import { serve } from "bun";
import index from "./index.html";

// Sample product data with flash sale information
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    image: "https://picsum.photos/seed/headphones/400/300",
    salePrice: 129.99,
    saleEndsAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from server start
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 149.99,
    image: "https://picsum.photos/seed/watch/400/300",
    salePrice: 99.99,
    saleEndsAt: Date.now() + 60 * 60 * 1000, // 1 hour
  },
  {
    id: 3,
    name: "Gaming Keyboard",
    price: 89.99,
    image: "https://picsum.photos/seed/keyboard/400/300",
  },
];

const server = serve({
  routes: {
    "/api/products": {
      async GET(req) {
        return Response.json(products);
      },
    },
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
