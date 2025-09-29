import { serve } from "bun";
import index from "./index.html";
import { products, coupons } from "./data";
import { Order } from "./types";

// In-memory storage for demo purposes
const orders: Order[] = [];

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Products API
    "/api/products": {
      async GET(req) {
        return Response.json({
          success: true,
          data: products
        });
      },
    },

    "/api/products/:id": async req => {
      const id = req.params.id;
      const product = products.find(p => p.id === id);
      
      if (!product) {
        return Response.json({
          success: false,
          error: "Product not found"
        }, { status: 404 });
      }

      return Response.json({
        success: true,
        data: product
      });
    },

    // Coupons API
    "/api/coupons/validate": {
      async POST(req) {
        try {
          const { code, orderAmount } = await req.json();
          
          const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
          
          if (!coupon) {
            return Response.json({
              success: false,
              error: "Invalid coupon code"
            }, { status: 400 });
          }

          if (!coupon.isActive) {
            return Response.json({
              success: false,
              error: "This coupon has expired"
            }, { status: 400 });
          }

          if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return Response.json({
              success: false,
              error: "This coupon has expired"
            }, { status: 400 });
          }

          if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return Response.json({
              success: false,
              error: "This coupon has reached its usage limit"
            }, { status: 400 });
          }

          if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
            return Response.json({
              success: false,
              error: `Minimum order amount of $${coupon.minOrderAmount} required`
            }, { status: 400 });
          }

          return Response.json({
            success: true,
            data: coupon
          });
        } catch (error) {
          return Response.json({
            success: false,
            error: "Invalid request"
          }, { status: 400 });
        }
      },
    },

    // Orders API
    "/api/orders": {
      async POST(req) {
        try {
          const orderData = await req.json();
          
          const order: Order = {
            id: 'ORDER-' + Date.now(),
            items: orderData.items,
            subtotal: orderData.subtotal,
            discount: orderData.discount,
            total: orderData.total,
            appliedCoupon: orderData.appliedCoupon,
            customerInfo: orderData.customerInfo,
            status: 'confirmed',
            createdAt: new Date()
          };

          // Simulate payment processing delay
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Store order (in real app, this would be in a database)
          orders.push(order);

          // Update coupon usage count if coupon was applied
          if (order.appliedCoupon) {
            const coupon = coupons.find(c => c.code === order.appliedCoupon!.code);
            if (coupon) {
              coupon.usedCount++;
            }
          }

          return Response.json({
            success: true,
            data: {
              orderId: order.id,
              status: order.status
            }
          });
        } catch (error) {
          return Response.json({
            success: false,
            error: "Failed to process order"
          }, { status: 500 });
        }
      },
    },

    "/api/orders/:id": async req => {
      const id = req.params.id;
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        return Response.json({
          success: false,
          error: "Order not found"
        }, { status: 404 });
      }

      return Response.json({
        success: true,
        data: order
      });
    },

    // Legacy hello endpoint for testing
    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
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
