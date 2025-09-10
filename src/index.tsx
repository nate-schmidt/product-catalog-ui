import { serve } from "bun";
import index from "./index.html";
import { CouponType } from "./types";

// Sample coupons data (in production, this would be in a database)
const COUPONS = [
  {
    id: '1',
    code: 'SAVE10',
    type: CouponType.PERCENTAGE,
    value: 10,
    description: '10% off your order',
    minOrderAmount: 5000,
    maxDiscount: 2000,
    expiresAt: new Date('2025-12-31'),
    usageLimit: 100,
    usedCount: 25,
    isActive: true
  },
  {
    id: '2',
    code: 'FLAT20',
    type: CouponType.FIXED_AMOUNT,
    value: 2000,
    description: '$20 off your order',
    minOrderAmount: 8000,
    expiresAt: new Date('2025-12-31'),
    usageLimit: 50,
    usedCount: 10,
    isActive: true
  },
  {
    id: '3',
    code: 'FREESHIP',
    type: CouponType.FREE_SHIPPING,
    value: 999,
    description: 'Free shipping on your order',
    minOrderAmount: 3000,
    expiresAt: new Date('2025-12-31'),
    usageLimit: 200,
    usedCount: 45,
    isActive: true
  },
  {
    id: '4',
    code: 'BIGDEAL',
    type: CouponType.PERCENTAGE,
    value: 25,
    description: '25% off your order',
    minOrderAmount: 15000,
    maxDiscount: 5000,
    expiresAt: new Date('2025-12-31'),
    usageLimit: 20,
    usedCount: 5,
    isActive: true
  }
];

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/coupons/validate": {
      async POST(req) {
        try {
          const { code, orderTotal } = await req.json();
          
          if (!code || typeof orderTotal !== 'number') {
            return Response.json(
              { isValid: false, error: 'Invalid request parameters' },
              { status: 400 }
            );
          }

          const coupon = COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());

          if (!coupon) {
            return Response.json({ isValid: false, error: 'Invalid coupon code' });
          }

          if (!coupon.isActive) {
            return Response.json({ isValid: false, error: 'This coupon is no longer active' });
          }

          if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return Response.json({ isValid: false, error: 'This coupon has expired' });
          }

          if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return Response.json({ isValid: false, error: 'This coupon has reached its usage limit' });
          }

          if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
            const minAmount = (coupon.minOrderAmount / 100).toFixed(2);
            return Response.json({ isValid: false, error: `Minimum order amount of $${minAmount} required` });
          }

          // Calculate discount
          let discountAmount = 0;
          
          switch (coupon.type) {
            case CouponType.PERCENTAGE:
              discountAmount = Math.round(orderTotal * (coupon.value / 100));
              if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
              }
              break;
            case CouponType.FIXED_AMOUNT:
              discountAmount = Math.min(coupon.value, orderTotal);
              break;
            case CouponType.FREE_SHIPPING:
              discountAmount = coupon.value;
              break;
          }

          return Response.json({
            isValid: true,
            coupon,
            discount: {
              amount: discountAmount,
              description: coupon.description
            }
          });

        } catch (error) {
          return Response.json(
            { isValid: false, error: 'Server error' },
            { status: 500 }
          );
        }
      },
    },

    "/api/coupons": {
      async GET(req) {
        return Response.json(COUPONS.filter(c => c.isActive));
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
