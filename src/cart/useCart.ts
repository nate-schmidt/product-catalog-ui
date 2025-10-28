// src/cart/useCart.ts
import { useContext, useCallback } from 'react';
import { CartContext } from './CartProvider';
import { getCartTotals } from './cartReducer';

/**
 * Hook to access cart state and actions
 */
export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  const { state, dispatch } = context;
  
  // Memoized action creators
  const addItem = useCallback(
    (productId: string, variantId: string | undefined, quantity: number, unitPriceCents: number) => {
      dispatch({
        type: 'addItem',
        item: { productId, variantId, quantity, unitPriceCents },
      });
    },
    [dispatch]
  );
  
  const removeItem = useCallback(
    (productId: string, variantId?: string) => {
      dispatch({ type: 'removeItem', productId, variantId });
    },
    [dispatch]
  );
  
  const incrementItem = useCallback(
    (productId: string, variantId?: string, by?: number) => {
      dispatch({ type: 'increment', productId, variantId, by });
    },
    [dispatch]
  );
  
  const setQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      dispatch({ type: 'setQuantity', productId, variantId, quantity });
    },
    [dispatch]
  );
  
  const clearCart = useCallback(() => {
    dispatch({ type: 'clear' });
  }, [dispatch]);
  
  // Derive totals
  const totals = getCartTotals(state);
  
  return {
    items: state.items,
    addItem,
    removeItem,
    incrementItem,
    setQuantity,
    clearCart,
    ...totals,
  };
}

