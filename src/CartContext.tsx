import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Cart, CartItem, Product, Coupon } from './types';
import { coupons } from './data';

interface CartState {
  cart: Cart;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: string }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cart: {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
  }
};

function calculateCart(items: CartItem[], appliedCoupon?: Coupon): Cart {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      // Don't apply coupon if minimum order amount not met
      appliedCoupon = undefined;
    } else {
      if (appliedCoupon.type === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
        if (appliedCoupon.maxDiscount) {
          discount = Math.min(discount, appliedCoupon.maxDiscount);
        }
      } else {
        discount = appliedCoupon.value;
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  return {
    items,
    subtotal,
    discount,
    total,
    appliedCoupon
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.cart.items.find(item => item.product.id === action.payload.id);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.cart.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.cart.items, { product: action.payload, quantity: 1 }];
      }

      return {
        cart: calculateCart(newItems, state.cart.appliedCoupon)
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter(item => item.product.id !== action.payload);
      return {
        cart: calculateCart(newItems, state.cart.appliedCoupon)
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.cart.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return {
        cart: calculateCart(newItems, state.cart.appliedCoupon)
      };
    }

    case 'APPLY_COUPON': {
      const coupon = coupons.find(c => c.code.toLowerCase() === action.payload.toLowerCase());
      if (!coupon) {
        throw new Error('Invalid coupon code');
      }
      if (!coupon.isActive) {
        throw new Error('This coupon has expired');
      }
      if (coupon.expiryDate && new Date() > coupon.expiryDate) {
        throw new Error('This coupon has expired');
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('This coupon has reached its usage limit');
      }

      return {
        cart: calculateCart(state.cart.items, coupon)
      };
    }

    case 'REMOVE_COUPON': {
      return {
        cart: calculateCart(state.cart.items)
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
}

interface CartContextType {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const applyCoupon = async (code: string) => {
    try {
      dispatch({ type: 'APPLY_COUPON', payload: code });
    } catch (error) {
      throw error;
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}