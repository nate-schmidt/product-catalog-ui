import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  expiryDate?: string;
  isActive: boolean;
}

interface CartContextType {
  items: CartItem[];
  coupon: Coupon | null;
  appliedCouponCode: string;
  couponError: string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
  getItemCount: () => number;
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
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setAppliedCouponCode('');
    setCouponError('');
  };

  const applyCoupon = async (code: string) => {
    try {
      setCouponError('');
      
      // Use mock API for now
      const { validateCoupon } = await import('./services/mockCouponApi');
      const validatedCoupon = await validateCoupon(code, getCartTotal());

      setCoupon(validatedCoupon);
      setAppliedCouponCode(code);
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : 'Failed to apply coupon');
      setCoupon(null);
      setAppliedCouponCode('');
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setAppliedCouponCode('');
    setCouponError('');
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    
    const cartTotal = getCartTotal();
    
    if (coupon.discountType === 'percentage') {
      return (cartTotal * coupon.discountValue) / 100;
    } else {
      return Math.min(coupon.discountValue, cartTotal);
    }
  };

  const getFinalTotal = () => {
    return Math.max(0, getCartTotal() - getDiscountAmount());
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    coupon,
    appliedCouponCode,
    couponError,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getDiscountAmount,
    getFinalTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};