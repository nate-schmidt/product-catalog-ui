import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, Product } from '../types/cart';
import { 
  getCartFromStorage, 
  addItemToCart as addToCartStorage,
  removeItemFromCart as removeFromCartStorage,
  updateItemQuantity as updateQuantityStorage,
  clearCart as clearCartStorage
} from '../utils/cartStorage';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
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
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    // Load cart from storage on mount
    const storedCart = getCartFromStorage();
    setCart(storedCart);
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    const updatedCart = addToCartStorage(product, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = removeFromCartStorage(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateQuantityStorage(productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const updatedCart = clearCartStorage();
    setCart(updatedCart);
  };

  const getCartItemCount = (): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};