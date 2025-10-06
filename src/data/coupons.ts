import { Coupon } from '../types';

export const validCoupons: Coupon[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
  },
  {
    code: 'SAVE20',
    discount: 20,
    type: 'percentage',
    minAmount: 100,
  },
  {
    code: 'FLASH50',
    discount: 50,
    type: 'fixed',
  },
  {
    code: 'VIP30',
    discount: 30,
    type: 'percentage',
    minAmount: 200,
  },
];

export function validateCoupon(code: string, totalAmount: number): Coupon | null {
  const coupon = validCoupons.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );

  if (!coupon) {
    return null;
  }

  // Check minimum amount requirement
  if (coupon.minAmount && totalAmount < coupon.minAmount) {
    return null;
  }

  return coupon;
}

export function calculateDiscount(coupon: Coupon, totalAmount: number): number {
  if (coupon.type === 'percentage') {
    return (totalAmount * coupon.discount) / 100;
  } else {
    return Math.min(coupon.discount, totalAmount);
  }
}
