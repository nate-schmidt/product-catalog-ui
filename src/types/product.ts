export interface FlashSale {
  salePrice: number;
  startsAt: string; // ISO8601
  endsAt: string;   // ISO8601
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  effectivePrice: number;
  flashSale?: FlashSale | null;
}