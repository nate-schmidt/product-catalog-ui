import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  appliedCoupon: Coupon | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_COUPON_CODE'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  couponCode: '',
  appliedCoupon: null,
};

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'SAVE10', discount: 10, type: 'percentage' },
  { code: 'SAVE20', discount: 20, type: 'percentage', minAmount: 50 },
  { code: 'WELCOME15', discount: 15, type: 'percentage' },
  { code: 'FIXED5', discount: 5, type: 'fixed' },
];

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    
    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload,
      };
    
    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null,
        couponCode: '',
      };
    
    case 'SET_COUPON_CODE':
      return {
        ...state,
        couponCode: action.payload,
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setCouponCode: (code: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const getSubtotal = (): number => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscount = (): number => {
    if (!state.appliedCoupon) return 0;
    
    const subtotal = getSubtotal();
    
    if (state.appliedCoupon.type === 'percentage') {
      return (subtotal * state.appliedCoupon.discount) / 100;
    } else {
      return Math.min(state.appliedCoupon.discount, subtotal);
    }
  };

  const getTotal = (): number => {
    return Math.max(0, getSubtotal() - getDiscount());
  };

  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    const subtotal = getSubtotal();
    
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return { 
        success: false, 
        message: `Minimum order amount of $${coupon.minAmount} required for this coupon` 
      };
    }

    dispatch({ type: 'APPLY_COUPON', payload: coupon });
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const setCouponCode = (code: string) => {
    dispatch({ type: 'SET_COUPON_CODE', payload: code });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    setCouponCode,
    clearCart,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
