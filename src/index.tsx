import { serve } from "bun";
import index from "./index.html";

// ------------------------------
// Domain models (server-side)
// ------------------------------
type Product = {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  currency: string;
};

type FlashSaleItem = {
  productId: string;
  salePrice: number;
};

type FlashSale = {
  id: string;
  name: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  items: FlashSaleItem[];
};

const now = () => new Date();
const toIso = (d: Date) => d.toISOString();

// Mock products
const products: Product[] = [
  { id: "prod-001", name: "Premium Sofa", manufacturer: "ComfortWorks", price: 199.99, currency: "USD" },
  { id: "prod-002", name: "Modern Chair", manufacturer: "UrbanSeating", price: 99.99, currency: "USD" },
  { id: "prod-003", name: "Stylish Table", manufacturer: "TableMakers", price: 149.99, currency: "USD" },
];

// Dynamic flash sale window
const saleStart = new Date(now().getTime() - 5 * 60 * 1000); // started 5 mins ago
const saleEnd = new Date(now().getTime() + 55 * 60 * 1000); // ends in 55 mins

const flashSales: FlashSale[] = [
  {
    id: "fs-1",
    name: "Launch Flash Sale",
    startsAt: toIso(saleStart),
    endsAt: toIso(saleEnd),
    items: [
      { productId: "prod-001", salePrice: 139.99 },
      { productId: "prod-002", salePrice: 69.99 },
    ],
  },
];

const isSaleActive = (sale: FlashSale, at: Date): boolean => {
  const starts = new Date(sale.startsAt).getTime();
  const ends = new Date(sale.endsAt).getTime();
  const t = at.getTime();
  return t >= starts && t < ends;
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Time sync for countdown
    "/api/time": async () => Response.json({ now: toIso(now()) }),

    // Catalog with flash sales
    "/api/catalog": async () => {
      const serverNow = now();
      return Response.json({
        serverNow: toIso(serverNow),
        products,
        flashSales,
        activeSaleIds: flashSales.filter(s => isSaleActive(s, serverNow)).map(s => s.id),
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});
