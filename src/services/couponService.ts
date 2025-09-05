import { api } from './api';
import { Coupon, CouponValidationResult } from '../types/coupon';

// Mock coupons for development
const mockCoupons: Coupon[] = [
  {
    code: 'SAVE10',
    description: '10% off your order',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
    minOrderAmount: 50,
    maxDiscount: 50,
  },
  {
    code: 'WELCOME20',
    description: '$20 off orders over $100',
    discountType: 'fixed',
    discountValue: 20,
    isActive: true,
    minOrderAmount: 100,
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on any order',
    discountType: 'fixed',
    discountValue: 10, // Assuming $10 shipping
    isActive: true,
  },
];

export const couponService = {
  async validateCoupon(
    code: string, 
    orderAmount: number
  ): Promise<CouponValidationResult> {
    try {
      // In a real app: return api.post('/coupons/validate', { code, orderAmount });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const coupon = mockCoupons.find(c => 
        c.code.toLowerCase() === code.toLowerCase() && c.isActive
      );
      
      if (!coupon) {
        return {
          isValid: false,
          discount: 0,
          message: 'Invalid coupon code',
        };
      }
      
      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return {
          isValid: false,
          discount: 0,
          message: `Minimum order amount of $${coupon.minOrderAmount} required`,
        };
      }
      
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = orderAmount * (coupon.discountValue / 100);
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }
      
      return {
        isValid: true,
        discount,
        message: `Coupon applied! ${coupon.description}`,
        coupon,
      };
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      return {
        isValid: false,
        discount: 0,
        message: 'Error validating coupon. Please try again.',
      };
    }
  },

  async getCoupon(code: string): Promise<Coupon | null> {
    try {
      // In a real app: return api.get(`/coupons/${code}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const coupon = mockCoupons.find(c => 
        c.code.toLowerCase() === code.toLowerCase() && c.isActive
      );
      
      return coupon || null;
    } catch (error) {
      console.error('Failed to fetch coupon:', error);
      throw error;
    }
  },
};