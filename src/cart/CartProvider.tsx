// src/cart/CartProvider.tsx
import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartState } from '../types/catalog';
import { cartReducer, type CartAction } from './cartReducer';

const STORAGE_KEY = 'pc.cart.v1';

const initialState: CartState = {
  items: [],
  version: 'v1',
};

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Load cart state from localStorage
 */
function loadCartFromStorage(): CartState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;
    
    const parsed = JSON.parse(stored) as CartState;
    
    // Validate version
    if (parsed.version !== 'v1') {
      console.warn('Cart version mismatch, resetting cart');
      return initialState;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return initialState;
  }
}

/**
 * Save cart state to localStorage
 */
function saveCartToStorage(state: CartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Lazy initialization - load from storage on mount
    return loadCartFromStorage();
  });
  
  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

