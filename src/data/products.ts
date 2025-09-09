export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

export const products: Product[] = [
  {
    id: "sku_basic_tee",
    name: "Basic Tee",
    description: "Soft cotton crew neck tee",
    priceCents: 2000,
  },
  {
    id: "sku_hoodie",
    name: "Cozy Hoodie",
    description: "Fleece-lined zip hoodie",
    priceCents: 5500,
  },
  {
    id: "sku_cap",
    name: "Classic Cap",
    description: "Adjustable cotton cap",
    priceCents: 1800,
  },
  {
    id: "sku_socks",
    name: "Everyday Socks (2-pack)",
    description: "Breathable crew socks",
    priceCents: 1200,
  },
];

export function findProductById(productId: string): Product | undefined {
  return products.find(p => p.id === productId);
}

