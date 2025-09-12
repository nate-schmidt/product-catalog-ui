export type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

export type FlashSale = {
  id: string;
  name: string;
  /** Inclusive start ISO string */
  startsAt: string;
  /** Exclusive end ISO string */
  endsAt: string;
  /** Map of productId to percentage discount (0-100) */
  discounts: Record<string, number>;
};

export const products: Product[] = [
  { id: "p1", name: "Wireless Headphones", priceCents: 12999 },
  { id: "p2", name: "Smart Watch", priceCents: 9999 },
  { id: "p3", name: "4K Monitor", priceCents: 27999 },
  { id: "p4", name: "Mechanical Keyboard", priceCents: 8999 },
];

/**
 * For demo purposes, create a flash sale that is active for 15 minutes from server start.
 */
const now = () => new Date();
const start = now();
const end = new Date(start.getTime() + 15 * 60 * 1000);

export const flashSales: FlashSale[] = [
  {
    id: "fs1",
    name: "15-Minute Lightning Deals",
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    discounts: {
      p1: 40,
      p2: 35,
      p3: 30,
      p4: 45,
    },
  },
];

export function getActiveFlashSale(referenceDate: Date = new Date()): FlashSale | null {
  for (const sale of flashSales) {
    const starts = new Date(sale.startsAt);
    const ends = new Date(sale.endsAt);
    if (referenceDate >= starts && referenceDate < ends) {
      return sale;
    }
  }
  return null;
}

export function computeDiscountedPriceCents(product: Product, sale: FlashSale | null): number {
  if (!sale) return product.priceCents;
  const discountPercent = sale.discounts[product.id];
  if (!discountPercent || discountPercent <= 0) return product.priceCents;
  const discounted = Math.round(product.priceCents * (1 - discountPercent / 100));
  return Math.max(0, discounted);
}

export function formatPriceFromCents(priceCents: number, locale = "en-US", currency = "USD"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceCents / 100);
}

