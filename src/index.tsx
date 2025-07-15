import { serve } from "bun";
import index from "./index.html";

const mockCoupons = {
  'SAVE10': {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true
  },
  'FLAT20': {
    code: 'FLAT20',
    discountType: 'fixed',
    discountValue: 20,
    minPurchaseAmount: 100,
    isActive: true
  },
  'WELCOME15': {
    code: 'WELCOME15',
    discountType: 'percentage',
    discountValue: 15,
    isActive: true
  }
};

const mockProducts = [
  {
    id: '1',
    name: 'Modern Sofa',
    price: 899.99,
    category: 'Living Room',
    description: 'Comfortable 3-seater sofa with premium fabric',
    stockQuantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
  },
  {
    id: '2',
    name: 'Wooden Dining Table',
    price: 1299.99,
    category: 'Dining Room',
    description: 'Solid wood dining table for 6 people',
    stockQuantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400'
  },
  {
    id: '3',
    name: 'Office Chair',
    price: 349.99,
    category: 'Office',
    description: 'Ergonomic office chair with lumbar support',
    stockQuantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'
  },
  {
    id: '4',
    name: 'Bedside Table',
    price: 149.99,
    category: 'Bedroom',
    description: 'Minimalist bedside table with drawer',
    stockQuantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=400'
  },
  {
    id: '5',
    name: 'Bookshelf',
    price: 299.99,
    category: 'Living Room',
    description: '5-tier modern bookshelf',
    stockQuantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400'
  },
  {
    id: '6',
    name: 'Coffee Table',
    price: 449.99,
    category: 'Living Room',
    description: 'Glass-top coffee table with storage',
    stockQuantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  }
];

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/products": {
      async GET(req) {
        return Response.json(mockProducts);
      }
    },

    "/api/coupons/validate/:code": {
      async POST(req) {
        const code = req.params.code;
        const body = await req.json();
        const cartTotal = body.cartTotal || 0;
        
        const coupon = mockCoupons[code.toUpperCase()];
        
        if (!coupon || !coupon.isActive) {
          return new Response(JSON.stringify({ error: 'Invalid coupon code' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
          return new Response(JSON.stringify({ 
            error: `Minimum purchase amount of $${coupon.minPurchaseAmount} required` 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return Response.json(coupon);
      }
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
