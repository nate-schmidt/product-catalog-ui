import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, Product, Cart } from './cartTypes';
import { readCart, writeCart, CART_KEY } from './cartStorage';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const cart = readCart();
    setItems(cart.items);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      const cart: Cart = {
        items,
        updatedAt: Date.now()
      };
      writeCart(cart);
    }
  }, [items, isHydrated]);

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_KEY && e.newValue) {
        try {
          const cart = JSON.parse(e.newValue) as Cart;
          if (Array.isArray(cart.items)) {
            setItems(cart.items);
          }
        } catch (error) {
          console.warn('Failed to parse cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity
        }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clear = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );

  const totalPrice = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [items]
  );

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clear
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
