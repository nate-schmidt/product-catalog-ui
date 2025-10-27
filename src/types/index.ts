export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discountAmount: number;
  finalTotal: number;
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percentage (0-100) or fixed amount in cents
  description: string;
  minOrderAmount?: number; // minimum order amount to apply coupon (in cents)
  maxDiscount?: number; // maximum discount amount for percentage coupons (in cents)
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  discount?: {
    amount: number;
    description: string;
  };
}