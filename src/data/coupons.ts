export type Coupon =
  | { code: string; type: "percent"; percentOff: number; active: boolean; maxUses?: number; uses?: number; minSubtotalCents?: number }
  | { code: string; type: "fixed"; amountOffCents: number; active: boolean; maxUses?: number; uses?: number; minSubtotalCents?: number };

// In-memory coupon list for demo purposes
export const coupons: Coupon[] = [
  { code: "WELCOME10", type: "percent", percentOff: 10, active: true },
  { code: "FREESHIP", type: "fixed", amountOffCents: 500, active: true, minSubtotalCents: 3000 },
  { code: "VIP20", type: "percent", percentOff: 20, active: true, minSubtotalCents: 5000 },
];

export type CouponValidation = {
  valid: boolean;
  reason?: string;
  code?: string;
  type?: "percent" | "fixed";
  percentOff?: number;
  amountOffCents?: number;
};

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase();
}

export function getCoupon(code: string): Coupon | undefined {
  const normalized = normalizeCode(code);
  return coupons.find(c => c.code === normalized);
}

export function validateCoupon(code: string, subtotalCents: number): CouponValidation {
  const coupon = getCoupon(code);
  if (!coupon) return { valid: false, reason: "Coupon not found" };
  if (!coupon.active) return { valid: false, reason: "Coupon is inactive" };
  if (coupon.maxUses && (coupon.uses || 0) >= coupon.maxUses) return { valid: false, reason: "Coupon usage limit reached" };
  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents)
    return { valid: false, reason: `Minimum subtotal ${(coupon.minSubtotalCents / 100).toFixed(2)} required` };

  if (coupon.type === "percent") {
    return { valid: true, code: coupon.code, type: coupon.type, percentOff: coupon.percentOff };
  }
  return { valid: true, code: coupon.code, type: coupon.type, amountOffCents: coupon.amountOffCents };
}

export function computeDiscountCents(validation: CouponValidation, subtotalCents: number): number {
  if (!validation.valid) return 0;
  if (validation.type === "percent" && validation.percentOff != null) {
    return Math.floor((subtotalCents * validation.percentOff) / 100);
  }
  if (validation.type === "fixed" && validation.amountOffCents != null) {
    return Math.min(validation.amountOffCents, subtotalCents);
  }
  return 0;
}

