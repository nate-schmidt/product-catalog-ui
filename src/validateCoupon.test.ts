import { test, expect, describe, beforeEach } from "bun:test";
import { validateCoupon, resetCoupons } from "./coupons";

describe("validateCoupon", () => {
  beforeEach(() => {
    resetCoupons();
  });

  test("returns valid for a fresh coupon", () => {
    const res = validateCoupon("SAVE10");
    expect(res.valid).toBe(true);
    expect(res.discount).toBe(10);
  });

  test("returns invalid for expired coupon", () => {
    const res = validateCoupon("EXPIRED5");
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("expired");
  });

  test("enforces usage limits", () => {
    // usageLimit for SAVE20 is 50; simulate 50 uses
    for (let i = 0; i < 50; i++) {
      const res = validateCoupon("SAVE20");
      expect(res.valid).toBe(true);
    }
    // 51st time should fail
    const final = validateCoupon("SAVE20");
    expect(final.valid).toBe(false);
    expect(final.reason).toBe("usage_limit");
  });

  test("returns invalid for unknown code", () => {
    const res = validateCoupon("UNKNOWN");
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("not_found");
  });
});