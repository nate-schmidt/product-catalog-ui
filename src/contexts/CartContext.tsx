import React, { createContext, useContext, ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { Product, CartItem } from '../types/cart';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: Product["id"]) => void;
  updateQuantity: (productId: Product["id"], quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartMethods = useCart();

  return (
    <CartContext.Provider value={cartMethods}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}