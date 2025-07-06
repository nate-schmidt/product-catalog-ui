export interface Coupon {
  discount: number; // Percentage discount or 0 for free shipping
  expires: Date; // Expiration date (inclusive)
  usageLimit: number; // Max number of times coupon can be used
  used: number; // How many times coupon has been used
}

const coupons: Record<string, Coupon> = {
  SAVE10: {
    discount: 10,
    expires: new Date("2099-12-31"),
    usageLimit: 100,
    used: 0,
  },
  SAVE20: {
    discount: 20,
    expires: new Date("2099-12-31"),
    usageLimit: 50,
    used: 0,
  },
  FREESHIP: {
    discount: 0,
    expires: new Date("2099-12-31"),
    usageLimit: 1000,
    used: 0,
  },
  EXPIRED5: {
    discount: 5,
    expires: new Date("2000-01-01"),
    usageLimit: 10,
    used: 0,
  },
};

export type CouponValidationResult = {
  valid: boolean;
  discount: number;
  reason?: string;
};

/**
 * Validate a coupon code.
 * If valid, increments its usage counter (mutates in-memory store).
 */
export function validateCoupon(code: string): CouponValidationResult {
  const key = code.toUpperCase();
  const coupon = coupons[key];
  if (!coupon) {
    return { valid: false, discount: 0, reason: "not_found" };
  }

  const now = new Date();
  if (now > coupon.expires) {
    return { valid: false, discount: 0, reason: "expired" };
  }

  if (coupon.used >= coupon.usageLimit) {
    return { valid: false, discount: 0, reason: "usage_limit" };
  }

  // Mark as used
  coupon.used += 1;
  return { valid: true, discount: coupon.discount };
}

/**
 * Utility to reset coupon usage counts (for testing).
 */
export function resetCoupons() {
  Object.values(coupons).forEach(c => {
    c.used = 0;
  });
}