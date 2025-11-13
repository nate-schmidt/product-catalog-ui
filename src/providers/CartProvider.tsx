import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  cartReducer,
  loadCart,
  saveCart,
  getTotalItems,
  getSubtotal,
  type CartState,
  type CartAction,
} from '../state/cart';

interface CartContextValue {
  items: CartState['items'];
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer<typeof cartReducer, undefined>(
    cartReducer,
    undefined,
    loadCart
  );

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const addItem = (product: { id: string; name: string; price: number }) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: product,
    } as CartAction);
  };

  const removeItem = (id: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id },
    } as CartAction);
  };

  const updateQty = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QTY',
      payload: { id, quantity },
    } as CartAction);
  };

  const clear = () => {
    dispatch({ type: 'CLEAR' } as CartAction);
  };

  const value: CartContextValue = {
    items: state.items,
    addItem,
    removeItem,
    updateQty,
    clear,
    totalItems: getTotalItems(state),
    subtotal: getSubtotal(state),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

