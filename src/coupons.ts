export type Coupon = {
  code: string;
  /**
   * percentage => value is 0-100 representing % off
   * fixed       => value is a flat currency amount to subtract
   */
  type: "percentage" | "fixed";
  value: number;
  /** ISO date string indicating when the coupon expires (optional) */
  expires?: string;
  /** Minimum cart subtotal required for coupon to be valid (optional) */
  minSubtotal?: number;
};

/**
 * In-memory coupon catalogue. In a real application this would live in a DB.
 */
export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 5,
  },
];

/**
 * Return the coupon matching `code` (case-insensitive) if it exists and is not expired.
 */
export function findCoupon(code: string): Coupon | null {
  const coupon = coupons.find(
    c => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
  if (!coupon) return null;
  if (coupon.expires && new Date(coupon.expires) < new Date()) return null;
  return coupon;
}

export function applyCoupon(subtotal: number, coupon: Coupon) {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { total: subtotal, discount: 0 };
  }
  let discount =
    coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value;

  // Ensure we never discount more than the subtotal.
  discount = Math.min(discount, subtotal);
  const total = +(subtotal - discount).toFixed(2);
  return { total, discount: +discount.toFixed(2) };
}