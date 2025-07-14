import React, { createContext, useContext, useMemo, useState } from "react";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product): void => {
    setItems((prev: CartItem[]): CartItem[] => {
      const existing = prev.find((i: CartItem) => i.id === product.id);
      if (existing) {
        return prev.map((it: CartItem) => (it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string): void => {
    setItems((prev: CartItem[]): CartItem[] => prev.filter((i: CartItem) => i.id !== productId));
  };

  const clearCart = (): void => setItems([]);

  const total = useMemo<number>(() => items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, clearCart, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};