export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount?: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}