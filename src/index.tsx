import { serve } from "bun";
import index from "./index.html";

// In-memory coupon store (can be replaced with database later)
interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  minimumOrderValue: number;
  active: boolean;
  description: string;
}

const coupons = new Map<string, Coupon>();

// Initialize with some sample coupons
coupons.set('WELCOME20', {
  code: 'WELCOME20',
  type: 'percentage',
  value: 20,
  expiryDate: '2025-12-31',
  usageLimit: 100,
  usedCount: 0,
  minimumOrderValue: 50,
  active: true,
  description: 'Welcome discount - 20% off'
});

coupons.set('SAVE10', {
  code: 'SAVE10',
  type: 'fixed',
  value: 10,
  expiryDate: '2025-06-30',
  usageLimit: 50,
  usedCount: 0,
  minimumOrderValue: 30,
  active: true,
  description: 'Save $10 on your order'
});

const server = serve({
  port: 3000,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Coupon API endpoints
    "/api/coupons": {
      // Get all coupons (admin)
      async GET(req) {
        const authHeader = req.headers.get('Authorization');
        // Simple auth check (in production, use proper authentication)
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return Response.json({
          coupons: Array.from(coupons.values())
        });
      },
      
      // Create new coupon (admin)
      async POST(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const body = await req.json();
        const coupon: Coupon = {
          code: body.code.toUpperCase(),
          type: body.type,
          value: body.value,
          expiryDate: body.expiryDate,
          usageLimit: body.usageLimit || 100,
          usedCount: 0,
          minimumOrderValue: body.minimumOrderValue || 0,
          active: body.active !== false,
          description: body.description || ''
        };
        
        if (coupons.has(coupon.code)) {
          return Response.json({
            error: 'Coupon code already exists'
          }, { status: 400 });
        }
        
        coupons.set(coupon.code, coupon);
        return Response.json({ success: true, coupon });
      }
    },
    
    "/api/coupons/:code": {
      // Delete coupon (admin)
      async DELETE(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const code = req.params.code.toUpperCase();
        if (!coupons.has(code)) {
          return Response.json({
            error: 'Coupon not found'
          }, { status: 404 });
        }
        
        coupons.delete(code);
        return Response.json({ success: true });
      },
      
      // Update coupon (admin)
      async PUT(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const code = req.params.code.toUpperCase();
        const coupon = coupons.get(code);
        if (!coupon) {
          return Response.json({
            error: 'Coupon not found'
          }, { status: 404 });
        }
        
        const body = await req.json();
        const updated: Coupon = {
          ...coupon,
          ...body,
          code: code // Ensure code doesn't change
        };
        
        coupons.set(code, updated);
        return Response.json({ success: true, coupon: updated });
      }
    },
    
    // Validate and apply coupon
    "/api/coupons/validate": {
      async POST(req) {
        const body = await req.json();
        const code = body.code?.toUpperCase();
        const orderValue = body.orderValue || 0;
        
        if (!code) {
          return Response.json({
            valid: false,
            error: 'Coupon code is required'
          }, { status: 400 });
        }
        
        const coupon = coupons.get(code);
        
        if (!coupon) {
          return Response.json({
            valid: false,
            error: 'Invalid coupon code'
          }, { status: 404 });
        }
        
        // Validation checks
        if (!coupon.active) {
          return Response.json({
            valid: false,
            error: 'This coupon is no longer active'
          });
        }
        
        const now = new Date();
        const expiry = new Date(coupon.expiryDate);
        if (now > expiry) {
          return Response.json({
            valid: false,
            error: 'This coupon has expired'
          });
        }
        
        if (coupon.usedCount >= coupon.usageLimit) {
          return Response.json({
            valid: false,
            error: 'This coupon has reached its usage limit'
          });
        }
        
        if (orderValue < coupon.minimumOrderValue) {
          return Response.json({
            valid: false,
            error: `Minimum order value of $${coupon.minimumOrderValue} required`
          });
        }
        
        // Calculate discount
        let discount = 0;
        if (coupon.type === 'percentage') {
          discount = (orderValue * coupon.value) / 100;
        } else {
          discount = Math.min(coupon.value, orderValue);
        }
        
        return Response.json({
          valid: true,
          coupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            description: coupon.description
          },
          discount: discount,
          finalPrice: orderValue - discount
        });
      }
    },
    
    // Apply coupon (mark as used)
    "/api/coupons/apply": {
      async POST(req) {
        const body = await req.json();
        const code = body.code?.toUpperCase();
        
        if (!code) {
          return Response.json({
            error: 'Coupon code is required'
          }, { status: 400 });
        }
        
        const coupon = coupons.get(code);
        if (!coupon) {
          return Response.json({
            error: 'Invalid coupon code'
          }, { status: 404 });
        }
        
        // Increment usage count
        coupon.usedCount++;
        coupons.set(code, coupon);
        
        return Response.json({
          success: true,
          message: 'Coupon applied successfully'
        });
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
