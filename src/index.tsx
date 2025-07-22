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

// Product management interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  image: string;
  inventory: number;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const coupons = new Map<string, Coupon>();
const products = new Map<string, Product>();

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

// Initialize with sample products
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful MacBook Pro ever.',
    price: 2499.99,
    salePrice: 2299.99,
    category: 'Laptops',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-gray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
    inventory: 15,
    active: true,
    tags: ['apple', 'laptop', 'professional', 'new-arrival'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling with Auto NC Optimizer, 30-hour battery life.',
    price: 399.99,
    category: 'Headphones',
    image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg',
    inventory: 42,
    active: true,
    tags: ['sony', 'wireless', 'noise-canceling', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Apple Watch Ultra 2',
    description: 'Rugged titanium case, precision GPS, and the brightest Apple display ever.',
    price: 799.99,
    category: 'Wearables',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-49-titanium-orange-ocean-band?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1694507270905',
    inventory: 28,
    active: true,
    tags: ['apple', 'smartwatch', 'fitness', 'outdoor'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Samsung 65" OLED 4K TV',
    description: 'Quantum HDR OLED technology with Neural Quantum Processor for stunning picture quality.',
    price: 1799.99,
    salePrice: 1499.99,
    category: 'TVs',
    image: 'https://image-us.samsung.com/SamsungUS/home/televisions-and-home-theater/tvs/oled-tvs/s95c/gallery/04062023/S95C_65_004_L-Perspective_Titan-Black.jpg',
    inventory: 8,
    active: true,
    tags: ['samsung', 'tv', 'oled', '4k', 'smart-tv'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'PlayStation 5',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback.',
    price: 499.99,
    category: 'Gaming',
    image: 'https://m.media-amazon.com/images/I/51eOztNdCkL._SL1500_.jpg',
    inventory: 12,
    active: true,
    tags: ['sony', 'gaming', 'console', 'entertainment'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Dyson V15 Detect',
    description: 'Most powerful cordless vacuum with laser dust detection and 60 minutes runtime.',
    price: 749.99,
    salePrice: 649.99,
    category: 'Home',
    image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/447034-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=960',
    inventory: 19,
    active: true,
    tags: ['dyson', 'vacuum', 'cordless', 'home-cleaning'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'iPhone 15 Pro Max',
    description: 'A17 Pro chip, titanium design, and the longest battery life ever in an iPhone.',
    price: 1199.99,
    category: 'Phones',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=940&hei=1112&fmt=png-alpha&.v=1693009279096',
    inventory: 35,
    active: true,
    tags: ['apple', 'iphone', 'smartphone', 'flagship'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Bose SoundLink Revolve+',
    description: '360° sound coverage, 17-hour battery life, water-resistant portable speaker.',
    price: 329.99,
    salePrice: 279.99,
    category: 'Audio',
    image: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/speakers/soundlink_revolve_plus_ii/product_silo_images/slrp_ii_black_EC_hero.png/_jcr_content/renditions/cq5dam.web.600.600.png',
    inventory: 54,
    active: true,
    tags: ['bose', 'speaker', 'portable', 'bluetooth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Canon EOS R5',
    description: '45MP full-frame sensor, 8K video recording, and advanced autofocus system.',
    price: 3899.99,
    category: 'Cameras',
    image: 'https://i1.adis.ws/i/canon/eos-r5-rf24-105mm-f4-l-is-usm-front-square_b3825e2e660a4e899df8e8d38cc0d332',
    inventory: 6,
    active: true,
    tags: ['canon', 'camera', 'professional', 'mirrorless'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'DJI Air 3',
    description: 'Dual-camera drone with 48MP photos, 4K/60fps HDR video, and 46-minute flight time.',
    price: 1099.99,
    category: 'Drones',
    image: 'https://dji-official-fe.djicdn.com/dps/12d18f27cf689e20051f1cf3c2369825.jpg',
    inventory: 14,
    active: true,
    tags: ['dji', 'drone', 'aerial', 'photography'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize products map
sampleProducts.forEach(product => {
  products.set(product.id, product);
});

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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
        const orderValue = body.orderValue || 0;
        
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
        
        // Validation checks before applying
        if (!coupon.active) {
          return Response.json({
            error: 'This coupon is no longer active'
          }, { status: 400 });
        }
        
        const now = new Date();
        const expiry = new Date(coupon.expiryDate);
        if (now > expiry) {
          return Response.json({
            error: 'This coupon has expired'
          }, { status: 400 });
        }
        
        if (coupon.usedCount >= coupon.usageLimit) {
          return Response.json({
            error: 'This coupon has reached its usage limit'
          }, { status: 400 });
        }
        
        if (orderValue < coupon.minimumOrderValue) {
          return Response.json({
            error: `Minimum order value of $${coupon.minimumOrderValue} required`
          }, { status: 400 });
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

    // Public products endpoint (no auth required)
    "/api/products/shop": {
      async GET(req) {
        // Return only active products for customers (including out of stock items)
        const activeProducts = Array.from(products.values())
          .filter(product => product.active);
        
        return Response.json({
          products: activeProducts
        });
      }
    },

    // Product API endpoints
    "/api/products": {
      // Get all products (admin)
      async GET(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }
        return Response.json({
          products: Array.from(products.values())
        });
      },

      // Create new product (admin)
      async POST(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const product: Product = {
          id: generateId(),
          name: body.name,
          description: body.description || '',
          price: body.price,
          salePrice: body.salePrice || undefined,
          category: body.category,
          image: body.image,
          inventory: body.inventory || 0,
          active: body.active !== false,
          tags: body.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (products.has(product.id)) {
          return Response.json({
            error: 'Product with this ID already exists'
          }, { status: 400 });
        }

        products.set(product.id, product);
        return Response.json({ success: true, product });
      }
    },

    "/api/products/:id": {
      // Get product by ID (admin)
      async GET(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }

        const id = req.params.id;
        const product = products.get(id);
        if (!product) {
          return Response.json({
            error: 'Product not found'
          }, { status: 404 });
        }
        return Response.json(product);
      },

      // Update product (admin)
      async PUT(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }

        const id = req.params.id;
        const product = products.get(id);
        if (!product) {
          return Response.json({
            error: 'Product not found'
          }, { status: 404 });
        }

        const body = await req.json();
        const updated: Product = {
          ...product,
          ...body,
          updatedAt: new Date().toISOString()
        };

        products.set(id, updated);
        return Response.json({ success: true, product: updated });
      },

      // Delete product (admin)
      async DELETE(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== 'Bearer admin-secret') {
          return new Response('Unauthorized', { status: 401 });
        }

        const id = req.params.id;
        if (!products.has(id)) {
          return Response.json({
            error: 'Product not found'
          }, { status: 404 });
        }

        products.delete(id);
        return Response.json({ success: true });
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
