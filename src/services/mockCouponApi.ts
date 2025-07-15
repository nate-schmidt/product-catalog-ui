interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  expiryDate?: string;
  isActive: boolean;
}

const mockCoupons: Coupon[] = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 50,
    isActive: true,
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchaseAmount: 100,
    isActive: true,
  },
  {
    code: 'FLAT50',
    discountType: 'fixed',
    discountValue: 50,
    minPurchaseAmount: 200,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 15,
    isActive: true,
  },
  {
    code: 'SUMMER25',
    discountType: 'percentage',
    discountValue: 25,
    minPurchaseAmount: 150,
    isActive: true,
  },
];

export const validateCoupon = async (code: string, cartTotal: number): Promise<Coupon> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    throw new Error('Invalid coupon code');
  }
  
  if (!coupon.isActive) {
    throw new Error('This coupon is no longer active');
  }
  
  if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
    throw new Error(`Minimum purchase amount of $${coupon.minPurchaseAmount} required`);
  }
  
  return coupon;
};