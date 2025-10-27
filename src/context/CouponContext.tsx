import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coupon, CouponValidationResult, CouponType } from '../types';

interface CouponState {
  appliedCoupon: Coupon | null;
  isLoading: boolean;
  error: string | null;
}

interface CouponContextType {
  state: CouponState;
  validateCoupon: (code: string, orderTotal: number) => Promise<CouponValidationResult>;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getAllCoupons: () => Coupon[];
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

// Sample coupons for demonstration
const SAMPLE_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'SAVE10',
    type: CouponType.PERCENTAGE,
    value: 10,
    description: '10% off your order',
    minOrderAmount: 5000, // $50
    maxDiscount: 2000, // $20 max discount
    expiresAt: new Date('2025-12-31'),
    usageLimit: 100,
    usedCount: 25,
    isActive: true
  },
  {
    id: '2',
    code: 'FLAT20',
    type: CouponType.FIXED_AMOUNT,
    value: 2000, // $20 off
    description: '$20 off your order',
    minOrderAmount: 8000, // $80 minimum
    expiresAt: new Date('2025-12-31'),
    usageLimit: 50,
    usedCount: 10,
    isActive: true
  },
  {
    id: '3',
    code: 'FREESHIP',
    type: CouponType.FREE_SHIPPING,
    value: 999, // $9.99 shipping cost
    description: 'Free shipping on your order',
    minOrderAmount: 3000, // $30 minimum
    expiresAt: new Date('2025-12-31'),
    usageLimit: 200,
    usedCount: 45,
    isActive: true
  },
  {
    id: '4',
    code: 'BIGDEAL',
    type: CouponType.PERCENTAGE,
    value: 25,
    description: '25% off your order',
    minOrderAmount: 15000, // $150 minimum
    maxDiscount: 5000, // $50 max discount
    expiresAt: new Date('2025-12-31'),
    usageLimit: 20,
    usedCount: 5,
    isActive: true
  },
  {
    id: '5',
    code: 'EXPIRED',
    type: CouponType.PERCENTAGE,
    value: 15,
    description: '15% off (expired)',
    expiresAt: new Date('2024-01-01'),
    usageLimit: 100,
    usedCount: 100,
    isActive: false
  }
];

export const CouponProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CouponState>({
    appliedCoupon: null,
    isLoading: false,
    error: null
  });

  const validateCoupon = async (code: string, orderTotal: number): Promise<CouponValidationResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const coupon = SAMPLE_COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Invalid coupon code' }));
      return { isValid: false, error: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      setState(prev => ({ ...prev, isLoading: false, error: 'This coupon is no longer active' }));
      return { isValid: false, error: 'This coupon is no longer active' };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      setState(prev => ({ ...prev, isLoading: false, error: 'This coupon has expired' }));
      return { isValid: false, error: 'This coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      setState(prev => ({ ...prev, isLoading: false, error: 'This coupon has reached its usage limit' }));
      return { isValid: false, error: 'This coupon has reached its usage limit' };
    }

    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      const minAmount = (coupon.minOrderAmount / 100).toFixed(2);
      setState(prev => ({ ...prev, isLoading: false, error: `Minimum order amount of $${minAmount} required` }));
      return { isValid: false, error: `Minimum order amount of $${minAmount} required` };
    }

    // Calculate discount
    let discountAmount = 0;
    
    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        discountAmount = Math.round(orderTotal * (coupon.value / 100));
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
        break;
      case CouponType.FIXED_AMOUNT:
        discountAmount = Math.min(coupon.value, orderTotal);
        break;
      case CouponType.FREE_SHIPPING:
        discountAmount = coupon.value; // Shipping cost
        break;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    
    return {
      isValid: true,
      discount: {
        amount: discountAmount,
        description: coupon.description
      }
    };
  };

  const applyCoupon = (coupon: Coupon) => {
    setState(prev => ({ ...prev, appliedCoupon: coupon, error: null }));
  };

  const removeCoupon = () => {
    setState(prev => ({ ...prev, appliedCoupon: null, error: null }));
  };

  const getAllCoupons = (): Coupon[] => {
    return SAMPLE_COUPONS;
  };

  return (
    <CouponContext.Provider value={{
      state,
      validateCoupon,
      applyCoupon,
      removeCoupon,
      getAllCoupons
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};