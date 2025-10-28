// src/cart/cartReducer.ts
import type { CartState, CartItem } from '../types/catalog';

export type CartAction =
  | { type: 'addItem'; item: { productId: string; variantId?: string; quantity: number; unitPriceCents: number } }
  | { type: 'removeItem'; productId: string; variantId?: string }
  | { type: 'increment'; productId: string; variantId?: string; by?: number }
  | { type: 'setQuantity'; productId: string; variantId?: string; quantity: number }
  | { type: 'clear' }
  | { type: 'hydrate'; state: CartState };

/**
 * Helper to find cart item index by productId and optional variantId
 */
function findItemIndex(items: CartItem[], productId: string, variantId?: string): number {
  return items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  );
}

/**
 * Cart reducer - handles all cart state mutations
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'addItem': {
      const existingIndex = findItemIndex(state.items, action.item.productId, action.item.variantId);
      
      if (existingIndex !== -1) {
        // Item already exists, increment quantity
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.item.quantity,
        };
        return { ...state, items: updatedItems };
      }
      
      // New item, add to cart
      return {
        ...state,
        items: [...state.items, action.item],
      };
    }
    
    case 'removeItem': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.productId && item.variantId === action.variantId)
        ),
      };
    }
    
    case 'increment': {
      const existingIndex = findItemIndex(state.items, action.productId, action.variantId);
      if (existingIndex === -1) return state;
      
      const updatedItems = [...state.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + (action.by ?? 1),
      };
      return { ...state, items: updatedItems };
    }
    
    case 'setQuantity': {
      const existingIndex = findItemIndex(state.items, action.productId, action.variantId);
      if (existingIndex === -1) return state;
      
      if (action.quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return {
          ...state,
          items: state.items.filter((_, i) => i !== existingIndex),
        };
      }
      
      const updatedItems = [...state.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: action.quantity,
      };
      return { ...state, items: updatedItems };
    }
    
    case 'clear': {
      return { ...state, items: [] };
    }
    
    case 'hydrate': {
      return action.state;
    }
    
    default:
      return state;
  }
}

/**
 * Derive cart totals from cart state
 */
export function getCartTotals(state: CartState) {
  const subtotalCents = state.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );
  
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subtotalCents,
    itemCount,
  };
}

