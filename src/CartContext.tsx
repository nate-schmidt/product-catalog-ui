import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  stockQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  expiryDate?: string;
  isActive: boolean;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      // Mock API call - replace with actual backend API
      const response = await fetch(`/api/coupons/validate/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          cartTotal: getCartTotal() 
        })
      });

      if (response.ok) {
        const coupon: Coupon = await response.json();
        setAppliedCoupon(coupon);
        return true;
      }
      return false;
    } catch (error) {
      // For now, use mock coupons
      const mockCoupons: Record<string, Coupon> = {
        'SAVE10': {
          code: 'SAVE10',
          discountType: 'percentage',
          discountValue: 10,
          isActive: true
        },
        'FLAT20': {
          code: 'FLAT20',
          discountType: 'fixed',
          discountValue: 20,
          minPurchaseAmount: 100,
          isActive: true
        },
        'WELCOME15': {
          code: 'WELCOME15',
          discountType: 'percentage',
          discountValue: 15,
          isActive: true
        }
      };

      const coupon = mockCoupons[code.toUpperCase()];
      if (coupon && coupon.isActive) {
        if (coupon.minPurchaseAmount && getCartTotal() < coupon.minPurchaseAmount) {
          return false;
        }
        setAppliedCoupon(coupon);
        return true;
      }
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    
    const cartTotal = getCartTotal();
    if (appliedCoupon.discountType === 'percentage') {
      return (cartTotal * appliedCoupon.discountValue) / 100;
    } else {
      return Math.min(appliedCoupon.discountValue, cartTotal);
    }
  };

  const getFinalTotal = () => {
    return Math.max(0, getCartTotal() - getDiscountAmount());
  };

  const value: CartContextType = {
    items,
    appliedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getDiscountAmount,
    getFinalTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};