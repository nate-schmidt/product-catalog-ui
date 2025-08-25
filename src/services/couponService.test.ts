import { describe, test, expect } from "bun:test";
import {
  calculateDiscountForSubtotal,
  validateCoupon,
  getKnownCoupons,
} from "./couponService";

describe("couponService", () => {
  test("validateCoupon returns not found for unknown codes", () => {
    const result = validateCoupon("unknown");
    expect(result.valid).toBeFalse();
  });

  test("percentage coupon applies correct discount", () => {
    const applied = calculateDiscountForSubtotal(200, "SAVE10");
    expect(applied.valid).toBeTrue();
    expect(applied.discountAmount).toBe(20);
  });

  test("fixed coupon caps at subtotal and respects min subtotal", () => {
    const tooLow = calculateDiscountForSubtotal(20, "TENOFF");
    expect(tooLow.valid).toBeFalse();

    const applied = calculateDiscountForSubtotal(50, "TENOFF");
    expect(applied.valid).toBeTrue();
    expect(applied.discountAmount).toBe(10);
  });

  test("max discount caps percentage amounts", () => {
    const applied = calculateDiscountForSubtotal(1000, "SAVE20");
    // 20% of 1000 = 200, but maxDiscount is 50
    expect(applied.valid).toBeTrue();
    expect(applied.discountAmount).toBe(50);
  });

  test("free shipping applies flag without discount amount", () => {
    const applied = calculateDiscountForSubtotal(30, "FREESHIP");
    expect(applied.valid).toBeTrue();
    expect(applied.discountAmount).toBe(0);
    expect(applied.freeShippingApplied).toBeTrue();
  });

  test("getKnownCoupons returns list", () => {
    const list = getKnownCoupons();
    expect(Array.isArray(list)).toBeTrue();
    expect(list.length).toBeGreaterThan(0);
  });
});

