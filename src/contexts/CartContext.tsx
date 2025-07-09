import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  // Coupon
  couponCode: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  // Totals
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState(0);

  // Helpers --------------------------------------------------------------
  const addItem: CartContextValue["addItem"] = item => {
    setItems(prev => {
      const existing = prev.find(it => it.id === item.id);
      if (existing) {
        return prev.map(it =>
          it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = id =>
    setItems(prev => prev.filter(it => it.id !== id));

  const clearCart: CartContextValue["clearCart"] = () => setItems([]);

  // Coupon management ----------------------------------------------------
  const COUPONS: Record<string, number> = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    FREESHIP: 0.05,
  };

  const applyCoupon: CartContextValue["applyCoupon"] = code => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      setCouponCode(key);
      setDiscountRate(COUPONS[key]);
      return true;
    }
    return false;
  };

  const removeCoupon: CartContextValue["removeCoupon"] = () => {
    setCouponCode(null);
    setDiscountRate(0);
  };

  // Totals ---------------------------------------------------------------
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const total = useMemo(() => subtotal * (1 - discountRate), [subtotal, discountRate]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    couponCode,
    discountRate,
    applyCoupon,
    removeCoupon,
    subtotal,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}