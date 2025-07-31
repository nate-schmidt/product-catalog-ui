import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartContextType, Product } from '../types';
import { 
  saveCartToStorage, 
  loadCartFromStorage, 
  createEmptyCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCartFromStorage
} from '../utils/cartStorage';

interface CartState {
  cart: Cart;
  isOpen: boolean;
}

type CartAction =
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: addItemToCart(state.cart, action.payload.product.id, action.payload.product, action.payload.quantity),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: removeItemFromCart(state.cart, action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: updateItemQuantity(state.cart, action.payload.productId, action.payload.quantity),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: createEmptyCart(),
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: createEmptyCart(),
    isOpen: false,
  });

  // Load cart from storage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  // Save cart to storage whenever cart changes
  useEffect(() => {
    if (state.cart.items.length > 0 || state.cart.total > 0) {
      saveCartToStorage(state.cart);
    }
  }, [state.cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    clearCartFromStorage();
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const contextValue: CartContextType = {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen: state.isOpen,
    toggleCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
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