import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem } from '../types/cart';
import { Product } from '../types/product';
import { Coupon } from '../types/coupon';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; coupon: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'RECALCULATE_TOTALS' };

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 10.00; // Flat $10 shipping
const FREE_SHIPPING_THRESHOLD = 50.00; // Free shipping over $50

function calculateTotals(items: CartItem[], couponDiscount = 0): Pick<Cart, 'subtotal' | 'tax' | 'shipping' | 'total'> {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const tax = discountedSubtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const total = discountedSubtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: action.quantity }];
      }
      
      const totals = calculateTotals(newItems, state.couponDiscount);
      return { ...state, items: newItems, ...totals };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      const totals = calculateTotals(newItems, state.couponDiscount);
      return { ...state, items: newItems, ...totals };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(item => item.product.id !== action.productId);
        const totals = calculateTotals(newItems, state.couponDiscount);
        return { ...state, items: newItems, ...totals };
      }
      
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      const totals = calculateTotals(newItems, state.couponDiscount);
      return { ...state, items: newItems, ...totals };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      };
    }
    
    case 'APPLY_COUPON': {
      const couponDiscount = action.coupon.discountType === 'percentage'
        ? Math.min(
            state.subtotal * (action.coupon.discountValue / 100),
            action.coupon.maxDiscount || Infinity
          )
        : action.coupon.discountValue;
      
      const totals = calculateTotals(state.items, couponDiscount);
      return {
        ...state,
        couponDiscount,
        appliedCoupon: action.coupon.code,
        ...totals
      };
    }
    
    case 'REMOVE_COUPON': {
      const totals = calculateTotals(state.items, 0);
      return {
        ...state,
        couponDiscount: undefined,
        appliedCoupon: undefined,
        ...totals
      };
    }
    
    case 'RECALCULATE_TOTALS': {
      const totals = calculateTotals(state.items, state.couponDiscount);
      return { ...state, ...totals };
    }
    
    default:
      return state;
  }
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

// Load cart from localStorage
function loadCartFromStorage(): Cart {
  if (typeof window === 'undefined') return initialCart;
  
  try {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Recalculate totals in case of price changes
      const totals = calculateTotals(parsed.items, parsed.couponDiscount);
      return { ...parsed, ...totals };
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  
  return initialCart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart, loadCartFromStorage);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const contextValue: CartContextType = {
    cart,
    addToCart: (product: Product, quantity = 1) => {
      dispatch({ type: 'ADD_TO_CART', product, quantity });
    },
    removeFromCart: (productId: string) => {
      dispatch({ type: 'REMOVE_FROM_CART', productId });
    },
    updateQuantity: (productId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    applyCoupon: (coupon: Coupon) => {
      dispatch({ type: 'APPLY_COUPON', coupon });
    },
    removeCoupon: () => {
      dispatch({ type: 'REMOVE_COUPON' });
    },
    getCartItemCount: () => {
      return cart.items.reduce((count, item) => count + item.quantity, 0);
    },
  };

  return (
    <CartContext.Provider value={contextValue}>
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