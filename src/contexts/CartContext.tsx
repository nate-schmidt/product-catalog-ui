import React, { createContext, useContext, useState, useMemo } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  discount: number;
  minPurchase?: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string;
  appliedCoupon: Coupon | null;
}

interface CouponResult {
  success: boolean;
  message: string;
}

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  setCouponCode: (code: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Available coupons
const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'SAVE10', type: 'percentage', discount: 10 },
  { code: 'SAVE20', type: 'percentage', discount: 20, minPurchase: 50 },
  { code: 'WELCOME15', type: 'percentage', discount: 15 },
  { code: 'FIXED5', type: 'fixed', discount: 5 },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = getSubtotal();

    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscount());
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const applyCoupon = (code: string): CouponResult => {
    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    const subtotal = getSubtotal();

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return {
        success: false,
        message: `Minimum purchase of $${coupon.minPurchase} required`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const value: CartContextValue = {
    state: { items, couponCode, appliedCoupon },
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    setCouponCode,
    clearCart,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Selector hook for CartIcon
export function useCartItemCount() {
  const { getItemCount } = useCart();
  return getItemCount();
}
