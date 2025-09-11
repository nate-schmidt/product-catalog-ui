import { serve } from "bun";
import index from "./index.html";

// In-memory demo data for products and flash sales
// In a real application this would come from a database or external service.

type FlashSaleConfig = {
  productId: string;
  salePrice: number;
  startsAt: number; // epoch millis
  endsAt: number;   // epoch millis
};

type ProductRecord = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
};

const productRecords: ProductRecord[] = [
  {
    id: "p-100",
    name: "Modern Armchair",
    description: "Upholstered armchair with solid wood legs",
    price: 199.0,
  },
  {
    id: "p-200",
    name: "Standing Desk",
    description: "Adjustable height desk, 48x24 inches",
    price: 499.0,
  },
  {
    id: "p-300",
    name: "LED Floor Lamp",
    description: "Dimmable floor lamp with reading light",
    price: 89.0,
  },
];

// Configure a sample flash sale window relative to server start
const nowAtBoot = Date.now();
const flashSales: FlashSaleConfig[] = [
  {
    productId: "p-100",
    salePrice: 149.0,
    startsAt: nowAtBoot + 30_000, // starts in 30s
    endsAt: nowAtBoot + 5 * 60_000, // ends in 5 minutes
  },
  {
    productId: "p-200",
    salePrice: 429.0,
    startsAt: nowAtBoot - 60_000, // started 1 minute ago
    endsAt: nowAtBoot + 2 * 60_000, // ends in 2 minutes
  },
];

function computeEffectiveProductList(currentTimeMs: number) {
  return productRecords.map(record => {
    const sale = flashSales.find(s => s.productId === record.id);
    const isActive = !!sale && currentTimeMs >= sale.startsAt && currentTimeMs <= sale.endsAt;

    const flashSale = sale
      ? {
          salePrice: sale.salePrice,
          startsAt: new Date(sale.startsAt).toISOString(),
          endsAt: new Date(sale.endsAt).toISOString(),
          active: isActive,
        }
      : null;

    const effectivePrice = isActive ? sale!.salePrice : record.price;

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      imageUrl: record.imageUrl,
      price: record.price,
      effectivePrice,
      flashSale,
    };
  });
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/time": {
      async GET() {
        return Response.json({ now: Date.now() });
      },
    },

    "/api/products": {
      async GET() {
        const list = computeEffectiveProductList(Date.now());
        return Response.json(list);
      },
    },

    "/api/flash-sales/active": {
      async GET() {
        const now = Date.now();
        const active = flashSales
          .filter(s => now >= s.startsAt && now <= s.endsAt)
          .map(s => ({
            productId: s.productId,
            salePrice: s.salePrice,
            endsAt: new Date(s.endsAt).toISOString(),
          }));
        return Response.json(active);
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
