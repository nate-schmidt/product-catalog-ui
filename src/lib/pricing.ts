import { findProductById } from "../data/products";
import { computeDiscountCents, validateCoupon } from "../data/coupons";
import type { CartItem, PriceSummary, LineItem } from "../types";

export function computeSummary(items: CartItem[], couponCode?: string | null): PriceSummary {
  const lineItems: LineItem[] = [];
  let subtotalCents = 0;

  for (const cartItem of items) {
    const product = findProductById(cartItem.productId);
    if (!product || cartItem.quantity <= 0) continue;
    const lineTotalCents = product.priceCents * cartItem.quantity;
    subtotalCents += lineTotalCents;
    lineItems.push({
      productId: product.id,
      name: product.name,
      unitPriceCents: product.priceCents,
      quantity: cartItem.quantity,
      lineTotalCents,
    });
  }

  let totalCents = subtotalCents;
  let coupon;
  if (couponCode && couponCode.trim().length > 0) {
    const validation = validateCoupon(couponCode, subtotalCents);
    if (validation.valid) {
      const discountCents = computeDiscountCents(validation, subtotalCents);
      totalCents = Math.max(0, subtotalCents - discountCents);
      coupon = {
        code: validation.code!,
        type: validation.type!,
        discountCents,
      } as const;
    }
  }

  return {
    items: lineItems,
    subtotalCents,
    coupon,
    totalCents,
  };
}

