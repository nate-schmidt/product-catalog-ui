export type CouponType = "percent" | "fixed";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number; // percent value (e.g., 10 for 10%) or fixed amount in currency units
  minSubtotal?: number; // optional minimum subtotal required to apply
}

const COUPON_INDEX: Record<string, Coupon> = {
  SAVE10: { code: "SAVE10", type: "percent", value: 10 },
  WELCOME5: { code: "WELCOME5", type: "fixed", value: 5, minSubtotal: 25 },
  BIGSAVE20: { code: "BIGSAVE20", type: "percent", value: 20, minSubtotal: 100 },
};

export function normalizeCouponCode(input: string): string {
  return input.trim().toUpperCase();
}

export function getCouponByCode(code: string): Coupon | undefined {
  return COUPON_INDEX[normalizeCouponCode(code)];
}

export function calculateDiscountAmount(subtotal: number, coupon: Coupon): number {
  if (subtotal <= 0) return 0;
  if (coupon.type === "percent") {
    const discount = (subtotal * coupon.value) / 100;
    return clampCurrency(discount, 0, subtotal);
  }
  // fixed
  return clampCurrency(coupon.value, 0, subtotal);
}

export function validateCoupon(code: string, subtotal: number): {
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  error?: string;
} {
  const normalized = normalizeCouponCode(code);
  if (!normalized) {
    return { valid: false, error: "Enter a coupon code" };
  }

  const coupon = COUPON_INDEX[normalized];
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      error: `Requires minimum subtotal of $${coupon.minSubtotal.toFixed(2)}`,
    };
  }

  const discountAmount = calculateDiscountAmount(subtotal, coupon);
  if (discountAmount <= 0) {
    return { valid: false, error: "Coupon does not apply to this subtotal" };
  }

  return { valid: true, coupon, discountAmount };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function clampCurrency(value: number, min: number, max: number): number {
  return Math.min(Math.max(roundToCents(value), min), max);
}

function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const STORAGE_KEY = "appliedCouponCode";

export function loadPersistedCouponCode(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistCouponCode(code: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, normalizeCouponCode(code));
  } catch {}
}

export function clearPersistedCouponCode(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

