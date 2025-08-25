import { AppliedCouponResult, Coupon, CouponValidationResult } from "../types/coupon";

// Simple in-memory catalog of coupons for now. Later can be replaced by API.
const COUPONS: Record<string, Coupon> = {
  SAVE10: {
    code: "SAVE10",
    type: "percentage",
    amount: 10,
    description: "Save 10% on your order",
    minSubtotal: 0,
  },
  SAVE20: {
    code: "SAVE20",
    type: "percentage",
    amount: 20,
    description: "Save 20% when you spend $100+",
    minSubtotal: 100,
    maxDiscount: 50,
  },
  TENOFF: {
    code: "TENOFF",
    type: "fixed",
    amount: 10,
    description: "$10 off your order",
    minSubtotal: 25,
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "free_shipping",
    description: "Free standard shipping",
    minSubtotal: 0,
  },
};

function isExpired(coupon: Coupon, now: Date = new Date()): boolean {
  if (!coupon.expiresAt) return false;
  const expiry = new Date(coupon.expiresAt);
  return now > expiry;
}

export function validateCoupon(codeRaw: string, now: Date = new Date()): CouponValidationResult {
  const code = codeRaw.trim().toUpperCase();
  const coupon = COUPONS[code];
  if (!coupon) return { valid: false, reason: "Coupon code not found" };
  if (isExpired(coupon, now)) return { valid: false, reason: "Coupon expired" };
  return { valid: true, coupon };
}

export function calculateDiscountForSubtotal(
  subtotal: number,
  codeRaw: string,
  now: Date = new Date()
): AppliedCouponResult {
  const code = codeRaw.trim().toUpperCase();
  const validation = validateCoupon(code, now);
  if (!validation.valid || !validation.coupon) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      freeShippingApplied: false,
      reason: validation.reason ?? "Invalid coupon",
    };
  }

  const coupon = validation.coupon;
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      freeShippingApplied: false,
      reason: `Requires minimum subtotal of $${coupon.minSubtotal.toFixed(2)}`,
    };
  }

  let discountAmount = 0;
  let freeShippingApplied = false;

  if (coupon.type === "percentage") {
    const percent = Math.max(0, Math.min(100, coupon.amount ?? 0));
    discountAmount = (subtotal * percent) / 100;
  } else if (coupon.type === "fixed") {
    discountAmount = Math.max(0, Math.min(subtotal, coupon.amount ?? 0));
  } else if (coupon.type === "free_shipping") {
    freeShippingApplied = true;
  }

  if (typeof coupon.maxDiscount === "number") {
    discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  }

  return {
    valid: true,
    code,
    discountAmount: Number(discountAmount.toFixed(2)),
    freeShippingApplied,
    description: coupon.description,
  };
}

export function getKnownCoupons(): Coupon[] {
  return Object.values(COUPONS);
}

