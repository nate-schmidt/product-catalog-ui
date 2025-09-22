import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, Cart } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  discountAmount: number;
  finalTotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (discount: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }
      
      const newTotal = calculateTotal(newItems);
      return {
        ...state,
        items: newItems,
        total: newTotal,
        finalTotal: newTotal - state.discountAmount
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const newTotal = calculateTotal(newItems);
      return {
        ...state,
        items: newItems,
        total: newTotal,
        finalTotal: newTotal - state.discountAmount
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const newTotal = calculateTotal(newItems);
      return {
        ...state,
        items: newItems,
        total: newTotal,
        finalTotal: newTotal - state.discountAmount
      };
    }
    
    case 'APPLY_DISCOUNT': {
      return {
        ...state,
        discountAmount: action.payload,
        finalTotal: state.total - action.payload
      };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        discountAmount: 0,
        finalTotal: 0
      };
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    discountAmount: 0,
    finalTotal: 0
  });

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const applyDiscount = (discount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: discount });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = (): number => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      applyDiscount,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};