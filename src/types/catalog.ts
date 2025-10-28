// src/types/catalog.ts
export type ProductId = string;

export interface ProductVariant {
  id: string;
  name: string;
  priceCents?: number;
  inventory: number;
}

export interface Product {
  id: ProductId;
  title: string;
  description?: string;
  priceCents: number;
  currency: 'USD' | 'EUR';
  imageUrls: string[];
  rating?: number; // 0..5
  badges?: Array<'sale' | 'new' | 'limited'>;
  inventory: number;
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: ProductId;
  variantId?: string;
  quantity: number;
  unitPriceCents: number;
}

export interface CartState {
  items: CartItem[];
  version: 'v1';
}

