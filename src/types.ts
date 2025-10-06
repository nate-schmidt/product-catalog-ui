export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number; // percentage (e.g., 20 for 20% off)
  type: 'percentage' | 'fixed';
  minAmount?: number;
}
