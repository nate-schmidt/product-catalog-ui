import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Represents a product in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the product */
  id: string;
  /** Display name of the product */
  name: string;
  /** Price of a single unit */
  price: number;
  /** Quantity of this product in the cart */
  quantity: number;
  /** Optional URL for the product image */
  imageUrl?: string;
}

/**
 * Shape of the cart context value
 */
export interface CartContextType {
  /** Array of items currently in the cart */
  items: CartItem[];
  /** Add a new item to the cart or increase quantity if it already exists */
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  /** Remove an item completely from the cart */
  removeItem: (id: string) => void;
  /** Update the quantity of a specific item */
  updateQuantity: (id: string, quantity: number) => void;
  /** Clear all items from the cart */
  clearCart: () => void;
  /** Calculate the total number of items in the cart */
  getTotalItems: () => number;
  /** Calculate the total price of all items in the cart */
  getTotalPrice: () => number;
}

/**
 * React Context for managing shopping cart state across the application
 * @example
 * ```tsx
 * // Wrap your app with CartProvider
 * <CartProvider>
 *   <App />
 * </CartProvider>
 * ```
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props for the CartProvider component
 */
interface CartProviderProps {
  /** Child components that will have access to the cart context */
  children: ReactNode;
}

/**
 * Provider component that manages cart state and provides it to child components
 * 
 * @component
 * @description This provider should wrap your application at a high level to ensure
 * all components that need cart functionality have access to it.
 * 
 * Features:
 * - Persistent cart state during the session
 * - Automatic quantity management when adding duplicate items
 * - Helper methods for calculating totals
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <CartProvider>
 *       <Header />
 *       <ProductCatalog />
 *       <CartDisplay />
 *     </CartProvider>
 *   );
 * }
 * ```
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  /**
   * Add an item to the cart or increment quantity if it already exists
   * @param item - Product to add (quantity will be set to 1 or incremented)
   */
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  /**
   * Remove an item completely from the cart
   * @param id - ID of the product to remove
   */
  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  /**
   * Update the quantity of a specific item
   * @param id - ID of the product to update
   * @param quantity - New quantity (removes item if 0 or less)
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Calculate the total number of items in the cart
   * @returns Sum of all item quantities
   */
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calculate the total price of all items in the cart
   * @returns Sum of (price * quantity) for all items
   */
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to access the cart context
 * 
 * @throws {Error} If used outside of a CartProvider
 * 
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const { addItem } = useCart();
 *   
 *   return (
 *     <button onClick={() => addItem(product)}>
 *       Add to Cart
 *     </button>
 *   );
 * }
 * ```
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};