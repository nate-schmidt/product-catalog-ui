/**
 * Coupon types based on the backend API model
 */

export type DiscountType = 'PERCENTAGE' | 'AMOUNT';

export interface CouponSummary {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minSubtotal?: number | null;
  appliesToCategory?: string | null;
  appliesToProductIds?: string | null;
  startAt?: string | null;
  endAt?: string | null;
}

export interface CouponValidationRequestItem {
  productId: number;
  quantity: number;
  price: number;
  category: string;
}

export interface CouponValidationRequest {
  code: string;
  items: CouponValidationRequestItem[];
  currency?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  messages: string[];
  subtotal: number;
  eligibleSubtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  coupon: CouponSummary | null;
}

// Backend DTOs for admin operations
export interface CouponRequestDTO {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minSubtotal?: number | null;
  appliesToCategory?: string | null;
  appliesToProductIds?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  active?: boolean;
  maxGlobalRedemptions?: number | null;
}

export interface CouponResponseDTO {
  id: number;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minSubtotal?: number | null;
  appliesToCategory?: string | null;
  appliesToProductIds?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  active: boolean;
  maxGlobalRedemptions?: number | null;
  globalRedemptions: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message: string;
}
