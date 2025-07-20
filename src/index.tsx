import { serve } from "bun";
import index from "./index.html";

// In-memory cart storage (in production, use a database)
const carts = new Map();

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

    // Cart API endpoints
    "/api/cart/:sessionId": {
      async GET(req) {
        const sessionId = req.params.sessionId;
        const cart = carts.get(sessionId) || { items: [], total: 0, itemCount: 0 };
        return Response.json(cart);
      },
      
      async POST(req) {
        const sessionId = req.params.sessionId;
        const body = await req.json();
        carts.set(sessionId, body);
        return Response.json({ success: true });
      },
      
      async DELETE(req) {
        const sessionId = req.params.sessionId;
        carts.delete(sessionId);
        return Response.json({ success: true });
      },
    },

    "/api/cart/:sessionId/items": {
      async POST(req) {
        const sessionId = req.params.sessionId;
        const item = await req.json();
        const cart = carts.get(sessionId) || { items: [], total: 0, itemCount: 0 };
        
        // Add or update item in cart
        const existingItemIndex = cart.items.findIndex(cartItem => 
          cartItem.product.id === item.product.id && 
          JSON.stringify(cartItem.selectedVariants || {}) === JSON.stringify(item.selectedVariants || {})
        );
        
        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
        
        // Recalculate totals
        cart.total = cart.items.reduce((sum, cartItem) => {
          let price = cartItem.product.price;
          if (cartItem.selectedVariants && cartItem.product.variants) {
            Object.entries(cartItem.selectedVariants).forEach(([type, value]) => {
              const variant = cartItem.product.variants?.[type]?.find(v => v.value === value);
              if (variant?.priceModifier) {
                price += variant.priceModifier;
              }
            });
          }
          return sum + (price * cartItem.quantity);
        }, 0);
        
        cart.itemCount = cart.items.reduce((count, cartItem) => count + cartItem.quantity, 0);
        
        carts.set(sessionId, cart);
        return Response.json({ success: true, cart });
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

console.log(`Server running at http://localhost:${server.port}`);
