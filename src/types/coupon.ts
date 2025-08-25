export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  code: string;
  type: CouponType;
  // For percentage, amount is 0-100; for fixed, amount is a currency value
  amount?: number;
  description?: string;
  expiresAt?: string; // ISO string
  minSubtotal?: number; // Minimum cart subtotal to apply
  maxDiscount?: number; // Cap the discount amount
  appliesToProductIds?: string[]; // Optional scoping, not enforced yet
}

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  coupon?: Coupon;
}

export interface AppliedCouponResult {
  valid: boolean;
  code: string;
  discountAmount: number; // Currency value
  freeShippingApplied: boolean;
  description?: string;
  reason?: string;
}

