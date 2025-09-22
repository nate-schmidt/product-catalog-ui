import React, { createContext, useContext, useMemo, useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
};

export type CartItem = Product & { quantity: number };

export type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartContextValue = {
  state: CartState;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  isItemInCart: (productId: string) => boolean;
  clearCart: () => void;
};

const defaultState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const noop = () => {};
const zero = () => 0;
const alwaysFalse = () => false;

const CartContext = createContext<CartContextValue>({
  state: defaultState,
  addItem: noop,
  updateQuantity: noop,
  getItemQuantity: zero,
  isItemInCart: alwaysFalse,
  clearCart: noop,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    return { totalItems, totalPrice };
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((p) => p.id !== productId);
      }
      return prev.map((p) =>
        p.id === productId ? { ...p, quantity } : p
      );
    });
  };

  const getItemQuantity = (productId: string) => {
    const found = items.find((p) => p.id === productId);
    return found ? found.quantity : 0;
  };

  const isItemInCart = (productId: string) => {
    return items.some((p) => p.id === productId);
  };

  const clearCart = () => setItems([]);

  const value: CartContextValue = {
    state: { items, totalItems: totals.totalItems, totalPrice: totals.totalPrice },
    addItem,
    updateQuantity,
    getItemQuantity,
    isItemInCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
