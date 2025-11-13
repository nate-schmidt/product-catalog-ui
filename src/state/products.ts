export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  inStock?: boolean;
  imageUrl?: string;
};

// Legacy hardcoded products - kept for fallback/development
// In production, products are fetched from the API
export const products: Product[] = [
  {
    id: "iphone-17",
    name: "iPhone 17",
    description:
      "The latest iPhone with advanced features, stunning display, and powerful performance.",
    price: 999,
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    description:
      "Professional-grade iPhone with enhanced camera system and ProMotion display.",
    price: 1199,
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    description:
      "The ultimate iPhone experience with the largest display and most advanced features.",
    price: 1399,
  },
];


