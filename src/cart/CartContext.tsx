import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product, CartContextType } from './cartTypes';
import { cartStorage } from './cartStorage';

// Cart actions
type CartAction = 
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

// Cart reducer
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, addedAt: new Date() }];
      }
      
      const totals = cartStorage.calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const totals = cartStorage.calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.product.id !== productId);
        const totals = cartStorage.calculateTotals(newItems);
        return { items: newItems, ...totals };
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      const totals = cartStorage.calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Context provider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], totalItems: 0, totalPrice: 0 });
  const [isLoading, setIsLoading] = React.useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    const savedCart = cartStorage.load();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0 || cart.totalItems > 0) {
      cartStorage.save(cart);
    }
  }, [cart]);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    cartStorage.clear();
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}